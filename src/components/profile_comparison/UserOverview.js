"use client";
import React from "react";
import {
    FaUsers,
    FaUserPlus,
    FaBook,
    FaMapMarkerAlt
} from "react-icons/fa";
import {
    IssueOpenedIcon,
    GitPullRequestIcon,
    StarIcon,
    RepoForkedIcon,
    GitCommitIcon
} from "@primer/octicons-react";
import UserRepositories from "@/components/profile_comparison/UserRepositories"

export default function UserOverview({ userProfile, repos, userCount, userColor }) {
    const user = userProfile;
    if (!user) return null;
    const isSideBySide = userCount <= 2;

    const stats = [
        {
            label: "Followers",
            value: user.followers,
            icon: <FaUsers className="text-green-500" />
        },
        {
            label: "Following",
            value: user.following,
            icon: <FaUserPlus className="text-purple-500" />
        },
        {
            label: "Public Repos",
            value: user.publicRepos,
            icon: <FaBook className="text-blue-500" />
        },
        {
            label: "Open Issues",
            value: user.openIssues,
            icon: <IssueOpenedIcon size={18} className="text-red-500" />
        },
        {
            label: "Pull Requests",
            value: user.pullRequests,
            icon: <GitPullRequestIcon size={18} className="text-pink-500" />
        },
        {
            label: "Total Commits",
            value: user.totalCommits,
            icon: <GitCommitIcon size={18} className="text-indigo-500" />
        },
        {
            label: "Stars",
            value: user.totalStars,
            icon: <StarIcon size={18} className="text-yellow-500" />
        },
        {
            label: "Forks",
            value: user.totalForks,
            icon: <RepoForkedIcon size={18} className="text-gray-500" />
        },
    ];

    return (
        <div className={`border border-gray-200 w-full bg-white rounded-lg p-4 ${isSideBySide ? "md:flex md:gap-6" : ""}`}>
            <div className={isSideBySide ? "md:w-1/2" : "w-full"}>
                <div className="flex items-center gap-4 mb-6">
                    <img
                        src={user.avatarUrl}
                        alt={`${user.login} avatar`}
                        className="w-16 h-16 rounded-full"
                        style={{
                            border: `2px solid ${userColor || "#ccc"}`,
                        }}
                    />
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {user.name || user.login}
                        </h2>
                        <a
                            title={`View @${user.login} on GitHub`}
                            href={`https://github.com/${user.login}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-semibold text-blue-600 hover:underline"
                        >
                            @{user.login}
                        </a>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <FaMapMarkerAlt/>
                            {user.location || "Unknown"}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex items-center gap-2">
                            <div className="text-xl m-2">{stat.icon}</div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase">
                                    {stat.label}
                                </div>
                                <div className="text-md font-medium text-gray-900">
                                    {stat.value}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {user.topLanguages && user.topLanguages.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Top Languages
                        </h3>
                        <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                            {[...user.topLanguages, ...Array(5 - user.topLanguages.length).fill(null)].map((lang, i) => (
                                <li
                                    key={lang?.name || `empty-${i}`}
                                    className={`flex items-center justify-between px-4 py-2 ${
                                        lang ? "bg-white hover:bg-gray-50" : "bg-gray-50"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{ backgroundColor: lang?.color || "#e5e7eb" }}
                                        />
                                        <span className="text-sm text-gray-700 font-medium">
                                          {lang?.name || <span className="text-gray-400 italic">—</span>}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500 font-medium">
                                        {lang?.percentage != null ? `${lang.percentage.toFixed(1)}%` : ""}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className={`${isSideBySide ? "md:w-1/2 mt-6 md:mt-0" : "mt-6"}`}>
                <UserRepositories repos={repos}/>
            </div>
        </div>
    );
}
