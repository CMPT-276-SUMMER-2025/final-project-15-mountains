"use client";
import { useState, useEffect } from "react";
import { Debounce } from "@/components/profile_comparison/Debounce";
import { SearchCache } from "@/components/profile_comparison/SearchCache";
import { FaGithub } from "react-icons/fa";

export default function SearchBar({ onSelect, cache }) {
    const [input, setInput] = useState("");
    const [resultsVisible, setResultsVisible] = useState(false);

    const stableInput = Debounce(input, 500);
    const results = SearchCache(input, stableInput, cache);

    useEffect(() => {
        if (input && results.length > 0) setResultsVisible(true);
        else setResultsVisible(false);
    }, [input, results]);

    const handleSelect = (userObject) => {
        onSelect(userObject);
        setInput("");
        setResultsVisible(false);
    };

    return (
        <div className="relative flex items-center border rounded px-4 py-3 bg-white">
            <FaGithub className="text-gray-700 text-xl mr-3 h-6 w-6"/>
            <input
                type="text"
                placeholder="Search GitHub users..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => {
                    if (results.length > 0) setResultsVisible(true);
                }}
                onBlur={() => {
                    setTimeout(() => setResultsVisible(false), 100);
                }}
                className="outline-none text-gray-800"
            />

            {input && (
                <button
                    type="button"
                    onClick={() => setInput("")}
                    className="absolute flex items-center justify-center rounded right-3 w-6 h-6
                               hover:cursor-pointer hover:bg-gray-100 transition"
                >
                    <span className="text-lg text-gray-800">&times;</span>
                </button>
            )}

            {resultsVisible && results.length > 0 && (
                <ul className="absolute top-full left-0 mt-1 bg-white w-full border rounded shadow z-1">
                    {results.map((user) => (
                        <li
                            key={user.id}
                            onMouseDown={() => handleSelect(user)}
                            className="cursor-pointer rounded px-3 py-2 hover:bg-gray-100"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={user.avatar_url}
                                    alt={user.login}
                                    className="w-6 h-6 rounded-full"
                                />
                                <span className="truncate">{user.login}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
