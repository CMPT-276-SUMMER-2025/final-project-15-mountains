"use client";
import {formatMetricLabel} from "@/app/profile_comparison/formatMetricLabel";

export default function Metrics({ userProfiles, activeMetric, setActiveMetric, getMetricValue, sortProfiles }) {
    const metrics = ["repos", "contributions", "commits", "prs", "issues", "stars", "forks"];
    const labelByMetric = {
        repos: "Repositories",
        contributions: "Contributions",
        commits: "Commits",
        prs: "Pull Requests",
        issues: "Issues",
        stars: "Stars",
        forks: "Forks",
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
            {metrics.map((metric) => {
                const sorted = sortProfiles(userProfiles, metric);
                const top = sorted[0];

                if (!top) return null;

                const topUser = {
                    login: top.login,
                    avatar_url: top.data.avatarUrl,
                    value: getMetricValue(top, metric),
                };

                return (
                    <button
                        key={metric}
                        onClick={() => setActiveMetric(metric)}
                        className={`h-auto px-6 py-4 rounded-xl text-left border transition-all duration-200
                        ${metric === activeMetric ? "bg-gray-900 text-white scale-105"
                            : "bg-white hover:bg-gray-50 text-gray-900"}`}
                    >
                        <div className="text-xl font-semibold mb-3 tracking-wide">
                            {labelByMetric[metric]}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-xl">🥇</div>
                            <img
                                src={topUser.avatar_url}
                                alt={topUser.login}
                                className="w-8 h-8 rounded-full border border-gray-300"
                            />
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate">@{topUser.login}</p>
                                <p className="text-xs opacity-70">
                                    {formatMetricLabel(topUser.value, metric)}
                                </p>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
