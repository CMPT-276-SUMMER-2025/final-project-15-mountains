"use client";
import { useState, useEffect } from "react";

export function SearchCache(input, stableInput, cacheRef) {
    const [results, setResults] = useState([]);
    const TTL = 1000 * 60 * 60;

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("searchCache") || "{}");

        const pruned = Object.fromEntries(
            Object.entries(stored).filter(
                ([_, value]) => Date.now() - value.timestamp < TTL
            )
        );

        const removed = Object.keys(stored).length - Object.keys(pruned).length;
        cacheRef.current = pruned;
        localStorage.setItem("searchCache", JSON.stringify(pruned));

        console.log(`Pruned searchCache entries: ${removed}`);
        Object.entries(pruned).forEach(([key, value]) => {
            console.log(`"${key}" expires @ ${(new Date(value.timestamp + TTL)).toLocaleTimeString()}`);
        });

        console.log("Initial Cache");
        console.table(cacheRef.current);
    }, [cacheRef]);

    useEffect(() => {
        const key = input.trim().toLowerCase();
        const stableKey = stableInput.trim().toLowerCase();

        if (!key) {
            setResults([]);
            return;
        }

        const cached = cacheRef.current[key];
        const isFresh = cached && Date.now() - cached.timestamp < TTL;

        if (isFresh) {
            setResults(cached.items || []);
            console.log(`Cache Found "${key}"`);
            return;
        }

        if (!stableKey || stableKey !== key) return;

        console.log(`[!] Fetching For: "${stableKey}" — using token`);
        fetch(`https://api.github.com/search/users?q=${stableKey}`, {
            headers: {
                Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            },
        })
            .then((res) => {
                return Promise.all([
                    res.json(),
                    res.headers.get("X-RateLimit-Limit"),
                    res.headers.get("X-RateLimit-Remaining"),
                    res.headers.get("X-RateLimit-Reset"),
                ]);
            })
            .then(([data, limit, remaining, reset]) => {
                const items = data.items?.slice(0, 5) || [];
                cacheRef.current[stableKey] = {
                    items,
                    timestamp: Date.now(),
                };
                localStorage.setItem("searchCache", JSON.stringify(cacheRef.current));
                setResults(items);
                console.log(`[!] Cache Update: "${stableKey}" — token used`);
                console.log(`>>> Rate Limit: ${limit}/${remaining} — Reset @ ${new Date(reset * 1000).toLocaleTimeString()}`);
            })
            .catch((err) => console.error(err));
    }, [input, stableInput, cacheRef]);

    return results;
}
