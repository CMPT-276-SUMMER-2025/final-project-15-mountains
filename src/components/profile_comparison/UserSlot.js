"use client";

export default function UserSlot({ users, removeUser }) {
    return (
        <div className="border border-red-500 flex flex-wrap justify-center gap-5">
            {users.map((user, index) => (
                <div
                    key={index}
                    className="border border-red-500 relative flex flex-col items-center gap-5 p-5"
                >
                    <button
                        type="button"
                        onClick={() => removeUser(user.login)}
                        className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full
                                   bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-red-500 transition"
                    >
                        <span className="text-sm leading-none">&times;</span>
                    </button>

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
