"use client";
import {useState, useRef, useEffect} from "react";
import ComparisonHeader from "@/components/profile_comparison/ComparisonHeader";
import SearchBar from "@/components/profile_comparison/SearchBar";
import UserSlot from "@/components/profile_comparison/UserSlot";
import {FaArrowRight} from "react-icons/fa";
import UserOverview from "@/components/profile_comparison/UserOverview";

export default function ProfileComparison() {
    const [users, setUsers] = useState([]);
    const [userProfiles, setUserProfiles] = useState([]);
    const [showAnalysis, setShowAnalysis] = useState(false);

    const cacheRef = useRef({});

    const addUser = (userObject) => {
        if (users.length >= 4) return;

        if (!users.some((u) => u.login === userObject.login))
            setUsers([...users, userObject]);
    };

    const removeUser = (login) => {
        setUsers(users.filter((u) => u.login !== login));
    };

    const handleAnalysis = async () => {
        if (users.length === 0) return;

        try {
            const userData = await Promise.all(
                users.map(async (user) => {
                    const res = await fetch("/api/github_api/profile_comparison", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ username: user.login }),
                    });

                    const json = await res.json();
                    return {
                        login: user.login,
                        data: json,
                    };
                })
            );

            setUserProfiles(userData);
            setShowAnalysis(true);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (users.length === 0) setShowAnalysis(false);
    }, [users]);

    return (
        <div className="m-10 p-5 mt-25">
            <ComparisonHeader />
            <div className="flex flex-col gap-5">
                <div className="flex justify-center">
                    <div className="flex flex-row justify-center w-1/3 gap-5">
                        <SearchBar onSelect={addUser} onRemove={removeUser} cache={cacheRef}/>
                        <button
                            type="submit"
                            onClick={handleAnalysis}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-bold transition 
                            bg-red-500 hover:bg-red-600 active:bg-red-700`}
                        >
                            <FaArrowRight className="text-white"/>
                            ANALYZE
                        </button>
                    </div>
                </div>

                <UserSlot users={users} removeUser={removeUser}/>
            </div>

            {showAnalysis && (
                <div className="mt-5">
                    <div className="flex bg-gray-50 rounded-lg border border-2 border-grey-400">
                        <div className="m-5 bg-white border border-grey-200 p-5 w-fit h-fit rounded-xl">
                            <UserOverview userProfile={userProfiles[0]} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
