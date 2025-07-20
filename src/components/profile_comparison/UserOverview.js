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

export default function UserOverview({ userProfile }) {
    const user = userProfile?.data?.user;
    if (!user) return null;

    const stats = [
        { label: "Followers", value: user.followers, icon: <FaUsers className="text-green-500" /> },
        { label: "Following", value: user.following, icon: <FaUserPlus className="text-purple-500" /> },
        { label: "Public Repos", value: user.publicRepos, icon: <FaBook className="text-blue-500" /> },
        { label: "Open Issues", value: user.openIssues, icon: <IssueOpenedIcon size={18} className="text-red-500" /> },
        { label: "Pull Requests", value: user.pullRequests, icon: <GitPullRequestIcon size={18} className="text-pink-500" /> },
        { label: "Total Commits", value: user.totalCommits, icon: <GitCommitIcon size={18} className="text-indigo-500" /> },
        { label: "Stars", value: user.totalStars, icon: <StarIcon size={18} className="text-yellow-500" /> },
        { label: "Forks", value: user.totalForks, icon: <RepoForkedIcon size={18} className="text-gray-500" /> },
    ];

    return (
        <div className="w-full max-w-md bg-white rounded-lg p-4">
            <div className="flex items-center gap-4 mb-6">
                <img
                    src={user.avatarUrl}
                    alt={`${user.login} avatar`}
                    className="w-16 h-16 rounded-full"
                />
                <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        {user.name || user.login}
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FaMapMarkerAlt />
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
        </div>
    );
}
