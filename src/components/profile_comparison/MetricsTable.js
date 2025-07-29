"use client";
import { getUserColor } from "@/app/profile_comparison/userColorManager";
import MetricsPieChart from "@/components/profile_comparison/MetricsPieChart";
import { formatMetricLabel } from "@/app/profile_comparison/formatMetricLabel"
import PRAcceptanceBarChart from "@/components/profile_comparison/PRAcceptanceBarChart"

export default function MetricsTable({ userProfiles, activeMetric, getMetricValue, sortProfiles, getPRAcceptance }) {
    const sorted = sortProfiles(userProfiles, activeMetric);
    const labelByMetric = {
        followers: "Followers",
        repos: "Repositories",
        contributions: "Contributions",
        commits: "Commits",
        issues: "Issues",
        prs: "Pull Requests",
        prAcceptance: "PR Acceptance Rate",
        stars: "Stars",
        forks: "Forks",
    };

    return (
        <div className="flex flex-col lg:flex-row gap-5 bg-white dark:bg-card p-6 rounded-lg border border-gray-200
                        dark:border-border">
            <div className="w-full lg:w-1/2">
                <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-foreground">
                    Rankings by {labelByMetric[activeMetric] ?? activeMetric}
                </h2>

                <div className="justify-center overflow-x-auto border border-gray-200 dark:border-border rounded-lg">
                    <table className="min-w-full text-sm text-left rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 dark:bg-muted text text-gray-700 dark:text-muted-foreground
                                          uppercase tracking-wide text-xs">
                        <tr>
                            <th className="py-3 px-4">Rank</th>
                            <th className="py-3 px-4">User</th>
                            {activeMetric === "prAcceptance" ? (
                                <>
                                    <th className="py-3 px-4">Opened</th>
                                    <th className="py-3 px-4">Merged</th>
                                    <th className="py-3 px-4">Acceptance Rate</th>
                                    </>
                                ) : (
                                <>
                                    <th className="py-3 px-4">{labelByMetric[activeMetric]}</th>
                                    <th className="py-3 px-4">Share</th>
                                    </>
                                )}
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
                                    className={`transition-all border-t border-gray-200 dark:border-border
                                        ${i === 0
                                            ? "bg-yellow-50 dark:bg-yellow-900/30 font-semibold hover:bg-amber-100 dark:hover:bg-amber-800/40"
                                            : "hover:bg-gray-100 dark:hover:bg-muted/30"
                                    }`}


                                >
                                    <td className="py-3 px-4 text-gray-800 dark:text-foreground">{i + 1}</td>

                                    <td className="py-3 px-4 flex items-center gap-2">
                                        <span
                                            className="inline-block w-3 h-3 rounded-full"
                                            style={{backgroundColor: getUserColor(user.login)}}
                                        ></span>
                                        <img
                                            src={user.data.avatarUrl}
                                            alt={user.login}
                                            className="w-5 h-5 rounded-full border border-[1.5px]"
                                            style={{
                                                border: `1.5px solid ${getUserColor(user.login)}`,
                                            }}
                                        />
                                        @{user.login}
                                    </td>

                                    {activeMetric === "prAcceptance" ? (
                                        <>
                                        <td className="py-3 px-4">{user.data.pullRequests}</td>
                                            <td className="py-3 px-4">{user.data.mergedPullRequests}</td>
                                            <td className="py-3 px-4">{value.toFixed(2)}%</td>
                                            </>
                                        ) : (
                                        <>
                                            <td className="py-3 px-4">
                                            {formatMetricLabel(value, activeMetric)}
                                            </td>
                                            <td className="py-3 px-4">{formattedPercent}</td>
                                            </>
                                        )}
                                </tr>
                            );
                        })}
                        </tbody>

                    </table>
                </div>
            </div>

            <div className="w-full lg:w-1/2 h-full flex items-center justify-center">
                {activeMetric === "prAcceptance" ? (
                    <PRAcceptanceBarChart
                        userProfiles={userProfiles}
                        getPRAcceptance={getPRAcceptance}
                    />
                ) : (
                    <MetricsPieChart
                        userProfiles={userProfiles}
                        activeMetric={activeMetric}
                        getMetricValue={getMetricValue}
                    />
                )}
            </div>
        </div>
    );
}
