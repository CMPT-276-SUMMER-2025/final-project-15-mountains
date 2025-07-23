"use client";
import { ResponsivePie } from "@nivo/pie";
import { useMemo } from "react";

export default function ContributionPieChart({ userProfiles, getUserColor }) {
    const data = useMemo(() => {
        return [...(userProfiles || [])]
            .sort((a, b) => b.data.publicRepos - a.data.publicRepos)
            .map((profile) => ({
                id: profile.login,
                label: `${profile.login}: ${profile.data.publicRepos}`,
                value: profile.data.publicRepos,
                color: getUserColor(profile.login),
            }));
    }, [userProfiles, getUserColor]);

    return (
        <div style={{ height: 400, width: 600 }}>
            <div className="text-xl text-center mb-2">Repositories</div>
            <ResponsivePie
                data={data}
                margin={{ top: 50, right: 50, bottom: 70, left: 50 }}
                innerRadius={0.6}
                padAngle={1.5}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={(d) => d.data.color}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: "color" }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
            />
        </div>
    );
}
