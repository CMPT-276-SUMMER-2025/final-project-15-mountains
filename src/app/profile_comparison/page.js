"use client";

import { useState } from "react";
import ComparisonHeader from "@/components/profile_comparison/ComparisonHeader";
import SearchBar from "@/components/profile_comparison/SearchBar";

export default function ProfileComparison() {
    const [users, setUsers] = useState([null, null]);

    const updateUser = (userObject, index) => {
        const updated = [...users];
        updated[index] = userObject;
        setUsers(updated);
    };

    return (
        <div className="border border-red-500 m-10 p-5 mt-25">
            <ComparisonHeader />

            <div className="border border-red-500">
                <div className="flex flex-row justify-center gap-10">
                    {users.map((user, index) => (
                        <div
                            key={index}
                            className="border border-red-500 flex flex-col items-center gap-5 p-5"
                        >
                            <SearchBar onSelect={(user) => updateUser(user, index)} />

                            {user && (
                                <div className="border border-red-500 flex flex-col items-center">
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.login}
                                        className="border-red-500 border-2 w-30 h-30 rounded-full"
                                    />
                                    <p className="border border-red-500 mt-2 font-semibold">@{user.login}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
