"use client";

export default function UserSlot({ users, updateUser, cacheRef }) {
    return (
        <div className="border border-red-500 flex flex-wrap justify-center gap-5">
            {users.map((user, index) => (
                <div
                    key={index}
                    className="border border-red-500 flex flex-col items-center gap-5 p-5"
                >
                    <img
                        src={user.avatar_url}
                        alt={user.login}
                        className="border-red-500 border-2 w-30 h-30 rounded-full"
                    />
                    <p className="border border-red-500 mt-2 font-semibold">
                        @{user.login}
                    </p>
                </div>
            ))}
        </div>
    );
}
