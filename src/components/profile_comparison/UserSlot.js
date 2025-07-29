"use client";
import {useState, useEffect} from "react";
import {
    getUserColorScheme,
    setUserColor,
    initializeUserColor,
} from "@/app/profile_comparison/userColorManager";
import ColorPicker from "@/components/profile_comparison/ColorPicker"

export default function UserSlot({ users, removeUser, onColorChange }) {
    const [colorMap, setColorMap] = useState({});

    useEffect(() => {
        const initial = {};
        users.forEach((u) => {
            initializeUserColor(u.login);
            const scheme = getUserColorScheme(u.login);
            initial[u.login] = scheme[2];
        });
        setColorMap(initial);
    }, [users.length]);

    const handleColorChange = (login, newColor, swapWithLogin = null) => {
        const updatedMap = { ...colorMap };

        if (swapWithLogin) {
            const temp = updatedMap[swapWithLogin];
            updatedMap[swapWithLogin] = updatedMap[login];
            updatedMap[login] = temp;

            setUserColor(login, updatedMap[login]);
            setUserColor(swapWithLogin, updatedMap[swapWithLogin]);
        } else {
            updatedMap[login] = newColor;
            setUserColor(login, newColor);
        }

        setColorMap(updatedMap);
        onColorChange?.();
    };

    return (
        <div className="flex flex-wrap justify-center gap-5 mb-5 text-foreground">
            {users.map((user, index) => {
                colorMap[user.login] || getUserColorScheme(user.login);
                return (
                    <div
                        key={index}
                        className="relative flex flex-col items-center gap-5 p-5"
                    >
                        <button
                            type="button"
                            onClick={() => removeUser(user.login)}
                            className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full
                                bg-gray-50 hover:bg-gray-200 text-gray-600 hover:text-red-500 dark:bg-muted
                                dark:hover:bg-muted/80 dark:text-foreground dark:hover:text-red-400 transition"
                        >
                            <span className="text-sm leading-none">&times;</span>
                        </button>

                        <img
                            src={user.avatar_url}
                            alt={user.login}
                            className="shadow-sm w-30 h-30 rounded-full"
                            style={{
                                border: `3px solid ${colorMap[user.login] ?? getUserColorScheme(user.login)[2]}`,
                            }}
                        />

                        <p className="font-semibold text-foreground">
                            @{user.login}
                        </p>

                        <ColorPicker
                            color={colorMap[user.login] ?? getUserColorScheme(user.login)[2]}
                            onChange={handleColorChange}
                            currentUser={user.login}
                            allUsers={users.map(u => ({
                                login: u.login,
                                assignedColor: colorMap[u.login] ?? getUserColorScheme(u.login)[2]
                            }))}
                        />
                    </div>
                );
            })}
        </div>
    );
}
