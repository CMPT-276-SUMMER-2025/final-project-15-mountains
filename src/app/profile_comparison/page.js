"use client";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import ComparisonHeader from "@/components/profile_comparison/ComparisonHeader";
import SearchBar from "@/components/profile_comparison/SearchBar";
import UserSlot from "@/components/profile_comparison/UserSlot";
import {FaArrowRight} from "react-icons/fa";
import UserOverview from "@/components/profile_comparison/UserOverview";
import ContributionHeatmap from "@/components/profile_comparison/ContributionHeatmap";
import { removeUserColor } from "@/app/profile_comparison/userColorManager";
import {
    getUserColorScheme,
    initializeUserColor,
} from "@/app/profile_comparison/userColorManager";
import { ClipLoader } from "react-spinners";
import Metrics from "@/components/profile_comparison/Metrics";
import MetricsTable from "@/components/profile_comparison/MetricsTable";
import RepositoryView from "@/components/profile_comparison/RepositoryView";

export default function ProfileComparison() {
    const [users, setUsers] = useState([]);
    const [userProfiles, setUserProfiles] = useState([]);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [colorChangeTrigger, setColorChangeTrigger] = useState(0);
    const [loading, setLoading] = useState(false);
    const [activeMetric, setActiveMetric] = useState("commits");
    const cacheRef = useRef({});
    const leftRef = useRef(null);
    const [leftHeight, setLeftHeight] = useState(0);

    const addUser = (userObject) => {
        if (users.length >= 4) return;

        if (!users.some((u) => u.login === userObject.login)) {
            initializeUserColor(userObject.login);
            setUsers([...users, userObject]);
        }
    };

    const removeUser = (login) => {
        const updatedUsers = users.filter((u) => u.login !== login);
        const updatedLogins = new Set(updatedUsers.map((u) => u.login));
        const syncedProfiles = userProfiles.filter((p) => updatedLogins.has(p.login));

        setUsers(updatedUsers);
        setUserProfiles(syncedProfiles);
        removeUserColor(login);

        if (syncedProfiles.length === 0) {
            setShowAnalysis(false);
        }
    };

    const handleAnalysis = async () => {
        if (users.length === 0) {
            console.log("No users to analyze");
            return;
        }

        console.log(`Starting analysis for ${users.length} user(s)`);
        setLoading(true);

        try {
            const userData = await Promise.all(
                users.map(async (user, index) => {
                    console.log(`Fetching data for @${user.login}`);

                    const profileRes = await fetch("/api/github_api/profile_comparison", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ username: user.login }),
                    });

                    if (!profileRes.ok) {
                        console.error(`Failed to fetch profile for @${user.login}`, profileRes.statusText);
                        throw new Error(`Failed to fetch profile data for ${user.login}`);
                    }

                    const profileJson = await profileRes.json();
                    console.log(`Data received for @${user.login}:`, profileJson);

                    return {
                        login: user.login,
                        data: profileJson.user,
                        repos: profileJson.repos,
                    };
                })
            );

            console.log("Profiles fetched successfully:", userData);
            setUserProfiles(userData);
            setShowAnalysis(true);
        } catch (err) {
            console.error("An error occurred during analysis:", err);
        } finally {
            setLoading(false);
            console.log("Analysis complete");
        }
    };

    useEffect(() => {
        if (users.length === 0) setShowAnalysis(false);
    }, [users]);

    const handleColorUpdate = () => {
        setColorChangeTrigger((prev) => prev + 1);
    };

    function getMetricValue(user, metric) {
        switch (metric) {
            case "followers":
                return user.data.followers ?? 0;
            case "repos":
                return user.data.publicRepos ?? 0;
            case "contributions":
                return user.data?.contributions
                    ? user.data.contributions.reduce((sum, d) => {
                        const year = new Date(d.date).getUTCFullYear();
                        const inferredYear = new Date().getUTCFullYear();
                        return year === inferredYear ? sum + d.count : sum;
                    }, 0)
                    : 0;
            case "commits":
                return user.data.totalCommits ?? 0;
            case "prs":
                return user.data.pullRequests ?? 0;
            case "issues":
                return user.data.openIssues ?? 0;
            case "stars":
                return user.data.totalStars ?? 0;
            case "forks":
                return user.data.totalForks ?? 0;
            case "prAcceptance":
                return getPRAcceptance(user);
            default:
                return 0;
        }
    }

    function sortProfiles(profiles, metric) {
        return [...profiles].sort(
            (a, b) => getMetricValue(b, metric) - getMetricValue(a, metric)
        );
    }

    const allRepos = userProfiles.flatMap((profile) =>
        profile.repos.map((repo) => ({ ...repo, owner: profile.login }))
    );

    useEffect(() => {
        const handleResize = () => {
            if (leftRef.current) {
                setLeftHeight(leftRef.current.getBoundingClientRect().height);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useLayoutEffect(() => {
        if (!leftRef.current) return;
        const observer = new ResizeObserver(() => {
            const height = leftRef.current.getBoundingClientRect().height;
            setLeftHeight(height);
        });
        observer.observe(leftRef.current);
        return () => observer.disconnect();
    }, [userProfiles, colorChangeTrigger]);

    const getPRAcceptance = (profile) => {
        const opened = profile.data.pullRequests ?? 0;
        const merged = profile.data.mergedPullRequests ?? 0;
        return opened > 0 ? (merged / opened) * 100 : 0;
    };

    return (
        <div className="w-full mt-20">
            <ComparisonHeader/>
            <div className="flex flex-col gap-10">
                <div className="flex justify-center">
                    <div className="flex flex-row justify-center w-1/3 gap-5">
                        <SearchBar onSelect={addUser} onRemove={removeUser} cache={cacheRef}/>
                        <button
                            type="submit"
                            onClick={handleAnalysis}
                            className={`w-[160px] flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border
                                        transition-transform duration-150 justify-center
                                        text-gray-800 dark:text-white
                                        ${loading
                                            ? "bg-gray-300 dark:bg-gray-700 border-gray-300 dark:border-gray-600 " +
                                              "cursor-not-allowed"
                                            : "bg-white hover:bg-gray-200 active:bg-gray-300 dark:bg-[#2a2a2a] " +
                                              "dark:hover:bg-[#3a3a3a] dark:active:bg-[#444] border-gray-300 " +
                                              "dark:border-border hover:scale-105"
                            }`}
                        >
                            {loading ? (
                                <ClipLoader size={20} color="currentColor"/>
                            ) : (
                                <FaArrowRight className="text-inherit"/>
                            )}
                            {loading ? "" : "Analyze"}
                        </button>

                    </div>
                </div>

                <UserSlot users={users} removeUser={removeUser} onColorChange={handleColorUpdate}/>
            </div>

            {showAnalysis && (
                <div className="flex border-t-1 border-gray-200 dark:border-border w-full bg-gray-50 dark:bg-slate-700
                                p-8 mt-5">
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-4 w-full items-stretch">
                            {userProfiles.map((profile) => (
                                <div key={profile.login} className="flex-1 min-w-0 flex flex-col">
                                    <UserOverview
                                        userProfile={profile.data}
                                        repos={profile.repos}
                                        userCount={userProfiles.length}
                                        userColor={getUserColorScheme(profile.login)[2]}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-row items-start gap-3">
                            <div ref={leftRef} className="flex flex-col gap-3">
                                <ContributionHeatmap
                                    key={colorChangeTrigger}
                                    userProfiles={userProfiles}
                                    getUserColor={getUserColorScheme}
                                />
                                <Metrics
                                    userProfiles={userProfiles}
                                    activeMetric={activeMetric}
                                    setActiveMetric={setActiveMetric}
                                    getMetricValue={getMetricValue}
                                    sortProfiles={sortProfiles}
                                    getUserColor={(login) => getUserColorScheme(login)[2]}
                                />
                            </div>

                            <div
                                className="bg-white dark:bg-card border border-gray-200 dark:border-border
                                           rounded-lg p-5"
                                style={{height: `${leftHeight}px`, overflow: 'hidden'}}
                            >
                                <RepositoryView
                                    allRepos={allRepos}
                                    maxHeight={leftHeight - 40}
                                    getUserColor={(login) => getUserColorScheme(login)[2]}
                                />
                            </div>
                        </div>

                        {showAnalysis && (
                            <>
                                <MetricsTable
                                    userProfiles={userProfiles}
                                    activeMetric={activeMetric}
                                    getMetricValue={getMetricValue}
                                    sortProfiles={sortProfiles}
                                    getPRAcceptance={getPRAcceptance}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
