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
        setUsers(users.filter((u) => u.login !== login));
        removeUserColor(login);
    };

    const handleAnalysis = async () => {
        if (users.length === 0) return;
        setLoading(true);

        try {
            const userData = await Promise.all(
                users.map(async (user) => {
                    const profileRes = await fetch("/api/github_api/profile_comparison", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ username: user.login }),
                    });

                    const profileJson = await profileRes.json();

                    return {
                        login: user.login,
                        data: profileJson.user,
                        repos: profileJson.repos,
                    };
                })
            );

            setUserProfiles(userData);
            setShowAnalysis(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
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
            case "prAcceptance":  return getPRAcceptance(user);
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

    useLayoutEffect(() => {
        if (!leftRef.current) return;
        const observer = new ResizeObserver(([entry]) => {
            setLeftHeight(entry.contentRect.height);
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
        <div className="container mx-auto px-4 py-6 mt-40">
            <ComparisonHeader/>
            <div className="flex flex-col gap-15 mb-10">
                <div className="flex justify-center">
                    <div className="flex flex-row justify-center w-1/3 gap-5">
                        <SearchBar onSelect={addUser} onRemove={removeUser} cache={cacheRef}/>
                        <button
                            type="submit"
                            onClick={handleAnalysis}
                            className={`w-[160px] flex items-center gap-2 px-6 py-3 rounded-lg font-bold border-none
                                        transition-transform duration-150 text-white justify-center
                                        ${loading ? "bg-gray-700 cursor-not-allowed" 
                                                  : "bg-black hover:bg-black-900 active:bg-gray-800 hover:scale-105"}`}
                        >
                            {loading ? <ClipLoader size={20} color="#fff" /> : <FaArrowRight className="text-white" />}
                            {loading ? "" : "Analyze"}
                        </button>
                    </div>
                </div>

                <UserSlot users={users} removeUser={removeUser} onColorChange={handleColorUpdate} />
            </div>

            {showAnalysis && (
                <div className="flex bg-gray-50 rounded-lg border border-2 border-grey-400 p-3 mt-5">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row justify-center gap-3">
                            {userProfiles.map((profile) => (
                                <div
                                    key={profile.login}
                                    className="bg-white border border-grey-200 p-5 rounded-xl w-fit h-fit"
                                >
                                    <UserOverview userProfile={profile.data} repos={profile.repos}/>
                                </div>
                            ))}
                        </div>
                        <div className="grid gap-5 grid-cols-2 grid-cols-[min-content_1fr] items-start gap-5">
                            <div ref={leftRef} className="flex flex-col gap-6">
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
                                />
                            </div>
                            <div
                                className="bg-white border rounded-xl p-5 flex flex-col overflow-hidden"
                                style={{maxHeight: leftHeight}}
                            >
                                <div className="flex-1 overflow-y-auto">
                                    <RepositoryView allRepos={allRepos}/>
                                </div>
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
