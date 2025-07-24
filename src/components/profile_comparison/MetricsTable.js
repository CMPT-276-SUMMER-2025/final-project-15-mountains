"use client";
import { getUserColor } from "@/app/profile_comparison/userColorManager";
import MetricsPieChart from "@/components/profile_comparison/MetricsPieChart";
import { formatMetricLabel } from "@/app/profile_comparison/formatMetricLabel"

export default function MetricsTable({ userProfiles, activeMetric, getMetricValue, sortProfiles }) {
    const sorted = sortProfiles(userProfiles, activeMetric);
    const labelByMetric = {
        commits: "Commits",
        prs: "Pull Requests",
        issues: "Issues",
        stars: "Stars",
    };

    return (
        <div className="flex flex-col lg:flex-row gap-5 mt-5 bg-white p-6 rounded-xl border shadow-sm">
            <div className="w-full lg:w-1/2">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Ranking by {labelByMetric[activeMetric] ?? activeMetric}
                </h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left border rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide text-xs">
                        <tr>
                            <th className="py-3 px-4">Rank</th>
                            <th className="py-3 px-4">User</th>
                            <th className="py-3 px-4">{labelByMetric[activeMetric]}</th>
                            <th className="py-3 px-4">Share</th>
                        </tr>
                        </thead>

                        <tbody>
                        {sorted.map((user, i) => {
                            const value = getMetricValue(user, activeMetric);
                            const total = sorted.reduce((acc, u) => acc + getMetricValue(u, activeMetric), 0);
                            const percent = total > 0 ? (value / total) * 100 : 0;

                            let formattedPercent;
                            if (percent === 100) {
                                formattedPercent = "100%";
                            } else if (percent > 99.99) {
                                formattedPercent = "> 99.99%";
                            } else if (percent === 0) {
                                formattedPercent = "0.00%";
                            } else if (percent < 0.01) {
                                formattedPercent = "< 0.01%";
                            } else {
                                formattedPercent = `${percent.toFixed(2)}%`;
                            }

                            return (
                                <tr
                                    key={user.login}
                                    className={`transition-all hover:bg-gray-50 border-t ${
                                        i === 0 ? "bg-yellow-50 font-semibold" : ""
                                    }`}
                                >
                                    <td className="py-3 px-4">{i + 1}</td>

                                    <td className="py-3 px-4 flex items-center gap-2">
                                        <span
                                            className="inline-block w-3 h-3 rounded-full"
                                            style={{backgroundColor: getUserColor(user.login)}}
                                        ></span>
                                        <img
                                            src={user.data.avatarUrl}
                                            alt={user.login}
                                            className="w-5 h-5 rounded-full border"
                                        />
                                        @{user.login}
                                    </td>

                                    <td className="py-3 px-4">{formatMetricLabel(value, activeMetric)}</td>
                                    <td className="py-3 px-4">{formattedPercent}</td>
                                </tr>
                            );
                        })}
                        </tbody>

                    </table>
                </div>
            </div>

            <div className="w-full lg:w-1/2 h-full flex items-center justify-center">
                <MetricsPieChart
                    userProfiles={userProfiles}
                    activeMetric={activeMetric}
                    getMetricValue={getMetricValue}
                />
            </div>
        </div>
    );
}
