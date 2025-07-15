"use client";
import { useState, useRef } from "react";
import ComparisonHeader from "@/components/profile_comparison/ComparisonHeader";
import UserSlot from "@/components/profile_comparison/UserSlot";

export default function ProfileComparison() {
    const [users, setUsers] = useState([null, null]);
    const cacheRef = useRef({});

    const updateUser = (userObject, index) => {
        const updated = [...users];
        updated[index] = userObject;
        setUsers(updated);
    };

    return (
        <div className="border border-red-500 m-10 p-5 mt-25">
            <ComparisonHeader />
            <UserSlot users={users} updateUser={updateUser} cacheRef={cacheRef} />
        </div>
    );
}
