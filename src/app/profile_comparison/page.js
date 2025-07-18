"use client";
import {useState, useRef, useEffect} from "react";
import ComparisonHeader from "@/components/profile_comparison/ComparisonHeader";
import SearchBar from "@/components/profile_comparison/SearchBar";
import UserSlot from "@/components/profile_comparison/UserSlot";
import {FaArrowRight} from "react-icons/fa";

export default function ProfileComparison() {
    const [users, setUsers] = useState([]);
    const [showAnalysis, setShowAnalysis] = useState(false);

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

    const handleAnalysis = () => {
        if (users.length > 0) setShowAnalysis(true);
        console.log(users);
    }

    useEffect(() => {
        if (users.length === 0) setShowAnalysis(false);
    }, [users]);

    return (
        <div className="border border-red-500 m-10 p-5 mt-25">
            <ComparisonHeader />
            <div className="border border-red-500 flex flex-col gap-5">
                <div className="border border-red-500 flex justify-center">
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
                    <div className="flex h-screen bg-gray-50 rounded-lg border border-2 border-grey-400">
                        <div className="">
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
