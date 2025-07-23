"use client";
import React from "react";
import { StarIcon, RepoForkedIcon } from "@primer/octicons-react";

export default function UserRepositories({ repos }) {
    if (!repos || repos.length === 0) {
        return (
            <p className="text-sm text-gray-500 mt-2">No public repositories found.</p>
        );
    }

    return (
        <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Repositories</h3>
            <div className="max-h-48 overflow-y-auto pr-1 space-y-2">
                {repos.map((repo) => (
                    <div
                        key={repo.name}
                        className="p-2 bg-gray-100 rounded-md shadow-sm text-sm hover:bg-gray-200 transition"
                    >
                        <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 font-medium hover:underline"
                        >
                            {repo.name}
                        </a>


                        {repo.description && (
                            <p className="text-gray-600">{repo.description}</p>
                        )}

                        {repo.primaryLanguage && (
                            <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                                <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: repo.primaryLanguage.color }}
                                />
                                <span>{repo.primaryLanguage.name}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <div className="flex items-center gap-1">
                                <StarIcon size={14} className="text-yellow-500" />
                                {repo.stargazerCount}
                            </div>
                            <div className="flex items-center gap-1">
                                <RepoForkedIcon size={14} className="text-gray-500" />
                                {repo.forkCount}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
