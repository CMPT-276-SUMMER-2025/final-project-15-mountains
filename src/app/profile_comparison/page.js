"use client";
import { useState, useRef } from "react";
import ComparisonHeader from "@/components/profile_comparison/ComparisonHeader";
import SearchBar from "@/components/profile_comparison/SearchBar";
import UserSlot from "@/components/profile_comparison/UserSlot";

export default function ProfileComparison() {
    const [users, setUsers] = useState([]);
    const cacheRef = useRef({});

    const addUser = (userObject) => {
        if (users.length >= 4) return;

        if (!users.some((u) => u.login === userObject.login)) {
            setUsers([...users, userObject]);
        }
    };

    const removeUser = (login) => {
        setUsers(users.filter((u) => u.login !== login));
    };

    return (
        <div className="border border-red-500 m-10 p-5 mt-25">
            <ComparisonHeader />
            <div className="border border-red-500 flex flex-col gap-5">
                <div className="border border-red-500 flex justify-center">
                    <div className="w-1/3">
                        <SearchBar onSelect={addUser} cache={cacheRef}/>
                    </div>
                </div>
                <UserSlot users={users} removeUser={removeUser} />
            </div>
        </div>
    );
}
