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

        // console.log(`[!] Pruned Entries: ${removed}`);
        Object.entries(pruned).forEach(([key, value]) => {
            // console.log(`"${key}" expires @ ${(new Date(value.timestamp + TTL)).toLocaleTimeString()}`);
        });

        // console.log("[!] Initial Cache:");
        // console.table(cacheRef.current);
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
            // console.log(`Cache Found "${key}"`);
            return;
        }

        if (!stableKey || stableKey !== key) return;

        // console.log(`[!] Fetching For: "${stableKey}" — using token`);
        fetch("/api/github_api/user_search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: stableKey }),
        })
            .then((res) => res.json())
            .then(({ data, limit, remaining, reset }) => {
                const items = data.items?.slice(0, 5) || [];
                cacheRef.current[stableKey] = {
                    items,
                    timestamp: Date.now(),
                };
                localStorage.setItem("searchCache", JSON.stringify(cacheRef.current));
                setResults(items);
                // console.log(`[!] Cache Update: "${stableKey}" — secure token used`);
                // console.log(`>>> Rate Limit: ${limit}/${remaining} — Reset @ ${new Date(reset * 1000).toLocaleTimeString()}`);
            })
            .catch((err) => console.error(err));
    }, [input, stableInput, cacheRef]);

    return results;
}
