"use client";
import React, {useState} from "react";
import { StarIcon, RepoForkedIcon, ClockIcon } from "@primer/octicons-react";

const SORT_OPTIONS = [
    { label: "Popularity", value: "popularity" },
    { label: "Stars", value: "stars" },
    { label: "Forks", value: "forks" },
    { label: "Last Updated", value: "updated" },
    { label: "Newest", value: "created" },
];

export default function UserRepositories({ repos }) {
    const [sortBy, setSortBy] = useState("popularity");

    if (!repos || repos.length === 0) {
        return (
            <p className="text-sm text-gray-500 mt-2">No public repositories found.</p>
        );
    }

    const sortedRepos = [...repos].sort((a, b) => {
        const ageA = (new Date() - new Date(a.createdAt)) / (1000 * 60 * 60 * 24);
        const ageB = (new Date() - new Date(b.createdAt)) / (1000 * 60 * 60 * 24);

        switch (sortBy) {
            case "stars":
                return b.stargazerCount - a.stargazerCount;
            case "forks":
                return b.forkCount - a.forkCount;
            case "updated":
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            case "created":
                return new Date(b.createdAt) - new Date(a.createdAt);
            case "popularity":
            default:
                return (b.stargazerCount / ageB) - (a.stargazerCount / ageA);
        }
    });

    const timeAgo = (dateStr) => {
        const now = new Date();
        const then = new Date(dateStr);
        const diffMs = now - then;

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (seconds < 60) return "Just now";
        if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
        if (days < 30) return `${Math.floor(days / 7)} week${days >= 14 ? "s" : ""} ago`;
        if (days < 365) return `${Math.floor(days / 30)} month${days >= 60 ? "s" : ""} ago`;

        return `${Math.floor(days / 365)} year${days >= 730 ? "s" : ""} ago`;
    };

    return (
        <div className="mt-2">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-gray-800">Repositories</h3>
                <select
                    className="text-sm border border-gray-300 rounded px-1 py-1"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            Sort by {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="h-120 overflow-y-auto space-y-3 p-1 m-1">
                {sortedRepos.map((repo) => (
                    <div
                        key={repo.name}
                        className="p-4 mx-1 bg-white shadow-sm border border-gray-200 rounded-md text-sm
                                   transition duration-100 ease-in-out transform hover:scale-[1.015]"
                    >
                        <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-base font-medium hover:underline"
                        >
                            {repo.name}
                        </a>

                        {repo.description && (
                            <p className="text-gray-600 text-sm mt-1">{repo.description}</p>
                        )}

                        {repo.primaryLanguage && (
                            <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
                                <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{backgroundColor: repo.primaryLanguage.color}}
                                />
                                <span>{repo.primaryLanguage.name}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                            <div className="flex items-center gap-1">
                                <StarIcon size={12} className="text-yellow-500"/>
                                {repo.stargazerCount}
                            </div>
                            <div className="flex items-center gap-1">
                                <RepoForkedIcon size={12} className="text-gray-500"/>
                                {repo.forkCount}
                            </div>
                        </div>

                        <div className="flex justify-between text-xs text-gray-500 mt-2 pr-1">
                            <div className="flex items-center gap-1">
                                <ClockIcon size={12}/>
                                <span>Updated {timeAgo(repo.updatedAt)}</span>
                            </div>
                            <div>
                                <span>
                                Created {new Date(repo.createdAt).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
