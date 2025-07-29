"use client";
import {formatMetricLabel} from "@/app/profile_comparison/formatMetricLabel";

export default function Metrics({ userProfiles, activeMetric, setActiveMetric, getMetricValue, sortProfiles, getUserColor }) {
    const metrics = [
        "followers",
        "repos",
        "contributions",
        "commits",
        "issues",
        "prs",
        "prAcceptance",
        "stars",
        "forks",
    ];
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
        <div className="rounded-lg border border-gray-200 dark:border-border bg-[#fafafa] dark:bg-muted overflow-visible">
        <div className="rounded-lg grid grid-cols-1 sm:grid-cols-3 bg-gray-200 dark:bg-border">
                {metrics.map((metric, i) => {
                    const sorted = sortProfiles(userProfiles, metric);
                    const top = sorted[0];

                    if (!top) return null;

                    const rawValue = getMetricValue(top, metric);
                    const roundedValue =
                        metric === "prAcceptance" ? parseFloat(rawValue.toFixed(1)) : rawValue;

                    const topUser = {
                        login: top.login,
                        avatar_url: top.data.avatarUrl,
                        value: roundedValue,
                    };

                    const isTopLeft = i === 0;
                    const isTopRight = i === 2;
                    const isBottomLeft = i === 6;
                    const isBottomRight = i === 8;

                    const cornerClass = `
                        ${isTopLeft ? "rounded-tl-lg" : ""}
                        ${isTopRight ? "rounded-tr-lg" : ""}
                        ${isBottomLeft ? "rounded-bl-lg" : ""}
                        ${isBottomRight ? "rounded-br-lg" : ""}
                    `;

                    return (
                        <button
                            key={metric}
                            onClick={() => setActiveMetric(metric)}
                            className={`h-auto px-6 py-4 text-left border transition-all duration-200
                                        ${metric === activeMetric
                                            ? `bg-black text-white shadow-md border border-black
                                               dark:bg-slate-100 dark:text-black scale-105`
                                            : `bg-[#fafafa] text-gray-900 hover:bg-gray-100
                                               dark:bg-muted dark:text-foreground dark:hover:bg-slate-50/10`
                            } ${cornerClass}`}
                        >
                            <div className="text-xl font-semibold mb-3 tracking-wide">
                                {labelByMetric[metric]}
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-xl">🥇</div>
                                <img
                                    src={topUser.avatar_url}
                                    alt={topUser.login}
                                    className="w-8 h-8 rounded-full border border-2"
                                    style={{borderColor: getUserColor?.(topUser.login) || "#d1d5db"}}
                                />
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium truncate">@{topUser.login}</p>
                                    <p
                                        className={`text-xs ${
                                        metric === activeMetric
                                            ? "opacity-80 dark:text-gray-700"
                                            : "opacity-70 dark:text-muted-foreground"
                                        }`}
                                    >
                                        {formatMetricLabel(topUser.value, metric)}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
        </div>
        </div>

    );
}
