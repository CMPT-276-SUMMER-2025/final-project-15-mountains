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
        <div className="bg-white border border-gray-200 p-4 rounded-lg w-fit">
            <div className="mt-5 flex flex-col gap-6">
                {userProfiles.map((profile) => {
                    const user = profile?.data?.user;
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
                        <div key={profile.login}>
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


