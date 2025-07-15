"use client";
import SearchBar from "@/components/profile_comparison/SearchBar";

export default function UserSlot({ users, updateUser, cacheRef }) {
    return (
        <div className="border border-red-500">
            <div className="flex flex-row justify-center gap-10">
                {users.map((user, index) => (
                    <div
                        key={index}
                        className="border border-red-500 flex flex-col items-center gap-5 p-5"
                    >
                        <SearchBar
                            onSelect={(user) => updateUser(user, index)}
                            cache={cacheRef}
                        />

                        {user && (
                            <div className="border border-red-500 flex flex-col items-center">
                                <img
                                    src={user.avatar_url}
                                    alt={user.login}
                                    className="border-red-500 border-2 w-30 h-30 rounded-full"
                                />
                                <p className="border border-red-500 mt-2 font-semibold">
                                    @{user.login}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
