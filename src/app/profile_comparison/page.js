"use client";
import {useState, useRef, useEffect} from "react";
import ComparisonHeader from "@/components/profile_comparison/ComparisonHeader";
import SearchBar from "@/components/profile_comparison/SearchBar";
import UserSlot from "@/components/profile_comparison/UserSlot";
import {FaArrowRight} from "react-icons/fa";
import UserOverview from "@/components/profile_comparison/UserOverview";
import ContributionHeatmap from "@/components/profile_comparison/ContributionHeatmap";
import { removeUserColor } from "@/app/profile_comparison/userColorManager";
import ContributionPieChart from "@/components/profile_comparison/ContributionPieChart";
import {
    getUserColorScheme,
    getUserColor,
    initializeUserColor,
} from "@/app/profile_comparison/userColorManager";
import { ClipLoader } from "react-spinners";

export default function ProfileComparison() {
    const [users, setUsers] = useState([]);
    const [userProfiles, setUserProfiles] = useState([]);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [colorChangeTrigger, setColorChangeTrigger] = useState(0);
    const [loading, setLoading] = useState(false);

    const cacheRef = useRef({});

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

    return (
        <div className="m-10 p-5 mt-40">
            <ComparisonHeader />
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
                        <div className="flex flex-row gap-3">
                            {userProfiles.map((profile) => (
                                <div
                                    key={profile.login}
                                    className="bg-white border border-grey-200 p-5 rounded-xl w-fit h-fit"
                                >
                                    <UserOverview userProfile={profile.data} repos={profile.repos}/>
                                </div>
                            ))}
                        </div>
                        <div>
                            <ContributionHeatmap
                                key={colorChangeTrigger}
                                userProfiles={userProfiles}
                                getUserColor={getUserColorScheme}
                            />
                        </div>
                        <div className="flex flex-col items-center bg-white border border-grey-200 pt-5
                                        rounded-xl w-fit h-fit">
                            <ContributionPieChart userProfiles={userProfiles} getUserColor={getUserColor} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
