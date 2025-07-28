"use client";

import { useState } from "react";
import { StarIcon, RepoForkedIcon, ClockIcon } from "@primer/octicons-react";

const SORT_OPTIONS = [
    { label: "Popularity", value: "popularity" },
    { label: "Stars", value: "stars" },
    { label: "Forks", value: "forks" },
    { label: "Last Updated", value: "updated" },
    { label: "Newest", value: "created" },
];

export default function RepositoryView({ allRepos, maxHeight }) {
    const [sortBy, setSortBy] = useState("popularity");

    if (!allRepos || allRepos.length === 0) {
        return <p className="text-sm text-gray-500">No repositories to display.</p>;
    }

    const sorted = [...allRepos].sort((a, b) => {
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
                return b.stargazerCount / ageB - a.stargazerCount / ageA;
        }
    });

    const timeAgo = (dateStr) => {
        const now = new Date();
        const then = new Date(dateStr);
        const diffMs = now - then;
        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(diffMs / 60000);
        const hours = Math.floor(diffMs / 3600000);
        const days = Math.floor(diffMs / 86400000);

        if (seconds < 60) return "Just now";
        if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
        if (days < 30) return `${Math.floor(days / 7)} week${days >= 14 ? "s" : ""} ago`;
        if (days < 365) return `${Math.floor(days / 30)} month${days >= 60 ? "s" : ""} ago`;
        return `${Math.floor(days / 365)} year${days >= 730 ? "s" : ""} ago`;
    };

    return (
        <div
            className="flex flex-col overflow-y-auto pe-3 -me-3 space-y-3 p-2"
            style={{maxHeight: maxHeight}}
        >
            <div className="flex flex-col gap-4 mb-4">
                <h3 className="text-lg font-bold text-gray-800">Top Repositories</h3>
                <div>
                    <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Rank by:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {SORT_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setSortBy(option.value)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
                                ${sortBy === option.value
                                    ? "bg-black text-white border-black shadow-md scale-105"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:scale-105"}`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div
                className="flex flex-col overflow-y-auto pe-3 -me-3 space-y-3"
                style={{maxHeight: maxHeight}}
            >
                {sorted.map((repo, index) => (
                    <div
                        key={`${repo.owner}/${repo.name}`}
                        className="bg-white border border-gray-200 rounded-md p-4 transition text-sm flex justify-between"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs font-bold text-gray-500">#{index + 1}</span>
                                <div className="relative group">
                                    <img
                                        src={repo.ownerAvatarUrl || `https://github.com/${repo.owner}.png`}
                                        alt={repo.owner}
                                        className="w-6 h-6 rounded-full border"
                                    />
                                    <div className="absolute z-10 hidden group-hover:flex transition-all duration-200
                                                    opacity-0 group-hover:opacity-100 text-xs bg-white text-gray-700
                                                    border border-gray-300 shadow px-2 py-1 rounded left-1/2
                                                    -translate-x-1/2 bottom-full mb-1 whitespace-nowrap">
                                        @{repo.owner}
                                    </div>
                                </div>
                                <a
                                    href={repo.url}
                                    className="text-base text-blue-600 font-semibold hover:underline"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {repo.name}
                                </a>
                            </div>

                            {repo.description && (
                                <p className="text-gray-600 text-sm mb-2">{repo.description}</p>
                            )}

                            {repo.primaryLanguage && (
                                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                                    <span
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{backgroundColor: repo.primaryLanguage.color}}
                                    />
                                    <span>{repo.primaryLanguage.name}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-5 text-xs text-gray-500 mb-1">
                                <div className="flex items-center gap-1">
                                    <StarIcon size={12} className="text-yellow-500"/>
                                    {repo.stargazerCount}
                                </div>
                                <div className="flex items-center gap-1">
                                    <RepoForkedIcon size={12}/>
                                    {repo.forkCount}
                                </div>
                            </div>

                            <div className="flex justify-between items-end text-xs text-gray-500 mt-2">
                                <div className="flex items-center gap-1">
                                    <ClockIcon size={12}/> Updated {timeAgo(repo.updatedAt)}
                                </div>
                                <span className="text-gray-400">
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
