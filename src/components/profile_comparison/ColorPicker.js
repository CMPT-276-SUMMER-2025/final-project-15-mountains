"use client";
import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { predefinedColors } from "@/app/profile_comparison/userColorManager";
import { FaExchangeAlt } from "react-icons/fa";

export default function ColorPicker({ color, onChange, currentUser, allUsers }) {
    const [open, setOpen] = useState(false);

    const usedColors = new Set(
        allUsers
            .filter((u) => u.login !== currentUser)
            .map((u) => u.assignedColor?.toLowerCase())
    );

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <button
                    className="w-6 h-6 rounded-full border shadow-inner transition-transform duration-200 ease-in-out
                               hover:scale-110 hover:shadow-lg"
                    style={{ backgroundColor: color }}
                />
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    sideOffset={5}
                    className="z-50 bg-white p-2 rounded-lg shadow-lg border w-[240px]"
                >
                    <div className="grid grid-cols-5 gap-2">
                        {predefinedColors.map((c) => {
                            const isUsed = usedColors.has(c);
                            const isActive = c === color;
                            const usedBy = allUsers.find(
                                (u) => u.assignedColor === c && u.login !== currentUser
                            );

                            return (
                                <button
                                    key={c}
                                    className={`w-8 h-8 rounded-full border-2 relative group transition 
                                        transform duration-150 ease-in-out
                                        hover:scale-110 hover:shadow-md
                                        ${isActive ? "" : ""}
                                    `}
                                    style={{
                                        backgroundColor: c,
                                        borderColor: isActive ? "#000" : "transparent"
                                    }}
                                    onClick={() => {
                                        if (!isUsed && !usedColors.has(c.toLowerCase())) {
                                            onChange(currentUser, c);
                                            setOpen(false);
                                        } else if (usedBy) {
                                            onChange(currentUser, c, usedBy.login);
                                            setOpen(false);
                                        }
                                    }}
                                >
                                    {isUsed && usedBy && (
                                        <div className="absolute inset-0 flex items-center justify-center rounded-full">
                                            <FaExchangeAlt className="text-white text-xs opacity-90 group-hover:scale-125
                                                                      transition-transform" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
