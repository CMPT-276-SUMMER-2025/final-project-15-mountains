"use client";
import { ResponsivePie } from "@nivo/pie";
import { getUserColor } from "@/app/profile_comparison/userColorManager";
import { useState } from "react";
import { formatMetricLabel } from "@/app/profile_comparison/formatMetricLabel"

export default function MetricsPieChart({ userProfiles, activeMetric, getMetricValue }) {
    const [tooltipData, setTooltipData] = useState(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    const total = userProfiles.reduce((acc, user) => acc + getMetricValue(user, activeMetric), 0);

    const data = userProfiles.map((user) => {
        const rawValue = getMetricValue(user, activeMetric);

        return {
            id: user.login,
            label: `@${user.login}`,
            value: rawValue === 0 ? 0 : rawValue < 10 ? 10 : rawValue,
            rawValue,
            percent: total > 0 ? (rawValue / total) * 100 : 0,
            color: getUserColor(user.login),
            avatar: user.data.avatarUrl,
        };
    });

    const handleMouseMove = (event) => {
        setCursorPos({ x: event.clientX, y: event.clientY });
    };

    return (
        <div
            className="relative w-full h-[400px] overflow-visible"
            onMouseMove={handleMouseMove}
        >
            <ResponsivePie
                data={data.filter(d => d.rawValue > 0)}
                margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
                innerRadius={0.5}
                padAngle={1.6}
                cornerRadius={3}
                minAngle={8}
                activeOuterRadiusOffset={8}
                colors={(d) => d.data.color}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                enableArcLabels={true}
                arcLabel={(d) => d.data.rawValue.toLocaleString()}
                arcLabelsSkipAngle={-1}
                arcLabelsTextColor="#fff"
                arcLabelsComponent={({ label, style }) => (
                    <text
                        x={style.x}
                        y={style.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{
                            ...style.style,
                            fill: "#fff",
                            fontWeight: "bold",
                            fontSize: 14,
                        }}
                    >
                        {label}
                    </text>
                )}
                enableArcLinkLabels={false}
                arcLinkLabelsSkipAngle={360}
                tooltip={() => null}
                onMouseEnter={(data) => {
                    const raw = data.data.rawValue;
                    const percentValue = data.data.percent;

                    let formattedPercent;
                    if (percentValue === 100) {
                        formattedPercent = "100%";
                    } else if (percentValue > 99.99) {
                        formattedPercent = "> 99.99%";
                    } else if (percentValue === 0) {
                        formattedPercent = "0.00%";
                    } else if (percentValue < 0.01) {
                        formattedPercent = "< 0.01%";
                    } else {
                        formattedPercent = `${percentValue.toFixed(2)}%`;
                    }

                    setTooltipData({
                        avatar: data.data.avatar,
                        label: data.label,
                        valueRaw: raw,
                        percent: formattedPercent,
                        metricKey: activeMetric,
                    });

                }}
                onMouseLeave={() => setTooltipData(null)}
            />

            {tooltipData && (
                <div
                    className="fixed pointer-events-none z-50 px-3 py-2 bg-white border border-gray-300 rounded
                               shadow-md flex items-center gap-2 text-sm whitespace-nowrap"
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
