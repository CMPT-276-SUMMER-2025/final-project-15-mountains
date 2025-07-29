"use client";
import React from "react";
import ActivityCalendar from "react-activity-calendar";

export default function ContributionHeatmap({ userProfiles, getUserColor }) {
    if (!userProfiles?.length) return null;

    const todayUTC = new Date(new Date().toISOString().split("T")[0]);

    const latestContributionDate = userProfiles
        .flatMap((profile) => profile?.data?.user?.contributions || [])
        .reduce((latest, current) => {
            const currentDate = new Date(current.date);
            return currentDate > latest ? currentDate : latest;
        }, new Date(0));

    const inferredYear = Math.max(latestContributionDate.getUTCFullYear(), todayUTC.getUTCFullYear());
    const fullYearTemplate = generateFullYearRangeUTC(inferredYear);

    return (
        <div className="flex flex-col p-4 bg-white border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold mt-2 ml-1 mb-6">Contributions This Year</h2>
            <div className="gap-6">
                {userProfiles.map((profile) => {
                    const user = profile?.data;
                    const raw = user?.contributions || [];

                    const counts = Object.fromEntries(
                        raw.map((d) => [d.date, d.count])
                    );
                    const max = Math.max(...raw.map((d) => d.count), 1);

                    const data = fullYearTemplate.map((day) => {
                        const count = counts[day.date] || 0;
                        return {
                            date: day.date,
                            count,
                            level: getLevel(count, max),
                        };
                    });

                    return (
                        <div className="mb-6" key={profile.login}>
                            <div className="flex items-center gap-2 mb-3">
                                <img
                                    src={user.avatarUrl}
                                    alt={profile.login}
                                    className="w-6 h-6 rounded-full border"
                                    style={{
                                        borderColor: getUserColor(profile.login)?.[2] || "#999",
                                        borderWidth: "1.5px"
                                    }}
                                />
                                <span className="font-medium text-sm text-gray-800">@{profile.login}</span>
                            </div>
                            <ActivityCalendar
                                data={data}
                                blockSize={11}
                                blockMargin={3}
                                fontSize={10}
                                weekStart={0}
                                showWeekdayLabels={true}
                                showMonthLabels={true}
                                theme={{
                                    light: getUserColor(profile.login),
                                }}
                                labels={{
                                    totalCount: `${getTotalCount(raw, inferredYear)} contributions in ${inferredYear}`,
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function getLevel(count, max) {
    if (count === 0) return 0;
    const ratio = count / max;
    if (ratio < 0.25) return 1;
    if (ratio < 0.5) return 2;
    if (ratio < 0.75) return 3;
    return 4;
}

function generateFullYearRangeUTC(year) {
    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year, 11, 31));

    const range = [];
    const cursor = new Date(start);

    while (cursor <= end) {
        range.push({
            date: cursor.toISOString().split("T")[0],
            count: 0,
        });
        cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return range;
}

function getTotalCount(raw, year) {
    return raw.reduce((sum, d) => {
        const dateYear = new Date(d.date).getUTCFullYear();
        return dateYear === year ? sum + d.count : sum;
    }, 0);
}


