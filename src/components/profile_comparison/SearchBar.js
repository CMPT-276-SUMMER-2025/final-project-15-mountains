"use client";
import { useState, useEffect } from "react";

export default function SearchBar({ onSelect }) {
    const [input, setInput] = useState("");

    useEffect(() => {
        if (!input) return;

        fetch("/api/github_api/profile_comparison", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: input }),
        })
            .then(res => res.json())
            .then(json => {
                console.log("Rate Limit:", json.rateLimit);
                const user = json?.user;
                if (user?.login) onSelect(user);
            })
            .catch(err => console.error(err));
    }, [input]);

    return (
        <div>
            <input
                type="text"
                placeholder="Search GitHub users..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="border px-4 py-2 rounded-sm"
            />
        </div>
    );
}
