"use client";
import { ResponsiveBar } from "@nivo/bar";
import { getUserColor } from "@/app/profile_comparison/userColorManager";
import { useState } from "react";
import { formatMetricLabel } from "@/app/profile_comparison/formatMetricLabel";

export default function PRAcceptanceBarChart({ userProfiles, getPRAcceptance }) {
    const [tooltipData, setTooltipData] = useState(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    const raw = userProfiles.map((u) => {
        const pct = parseFloat(getPRAcceptance(u).toFixed(1));
        return {
            id: `@${u.login}`,
            value: pct,
            avatar: u.data.avatarUrl,
            color: getUserColor(u.login),
        };
    });

    const data = [...raw].sort((a, b) => b.value - a.value);

    return (
        <div
            className="relative w-full h-[400px] overflow-visible"
            onMouseMove={(e) => setCursorPos({x: e.clientX, y: e.clientY})}
        >
            <ResponsiveBar
                data={data}
                keys={["value"]}
                indexBy="id"
                margin={{ top: 30, right: 30, bottom: 100, left: 60 }}
                padding={0.4}
                colors={(d) => d.data.color}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                axisLeft={{
                    tickValues: [0, 25, 50, 75, 100],
                    format: (v) => `${v}%`,
                }}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 20,
                    tickRotation: 0,
                    renderTick: ({ value, x, y }) => {
                        const item = data.find((d) => d.id === value);
                        return (
                            <foreignObject
                                key={value}
                                x={x - 12}
                                y={y + 4}
                                width={24}
                                height={24}
                            >
                                <img
                                    src={item.avatar}
                                    alt={value}
                                    style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                                />
                            </foreignObject>
                        );
                    },
                }}
                enableLabel={true}
                label={(d) => `${d.value}%`}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="#fff"
                theme={{
                    labels: { text: { fontSize: 16, fontWeight: 800 } },
                }}
                tooltip={() => null}
                onMouseEnter={(bar) =>
                    setTooltipData({
                        avatar: bar.data.avatar,
                        label: bar.id,
                        valueRaw: bar.data.value,
                        percent: `${bar.data.value}%`,
                        metricKey: "prAcceptance",
                    })
                }
                onMouseLeave={() => setTooltipData(null)}
            />

            {tooltipData && (
                <div
                    className="fixed pointer-events-none z-50 px-3 py-2 bg-white border border-gray-300 rounded shadow-md flex items-center gap-2 text-sm whitespace-nowrap"
                    style={{
                        top: cursorPos.y + 12,
                        left: cursorPos.x + 12,
                        transition: "top 0.05s, left 0.05s",
                    }}
                >
                    <img
                        src={tooltipData.avatar}
                        alt={tooltipData.label}
                        className="w-6 h-6 rounded-full border"
                    />
                    <div>
                        <p className="font-semibold text-black">{tooltipData.label}</p>
                        <p className="text-xs text-gray-600">
                            {formatMetricLabel(tooltipData.valueRaw, tooltipData.metricKey)}
                        </p>
                        <p className="text-xs font-semibold text-black">
                            {tooltipData.percent}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
