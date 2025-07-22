const defaultColorScheme = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
const userColors = new Map();

export function getDefaultColorScheme() {
    return defaultColorScheme;
}

export function getUserColorScheme(login) {
    const entry = userColors.get(login);
    return entry ? entry.scheme : getDefaultColorScheme();
}

export function removeUserColor(login) {
    const entry = userColors.get(login);
    if (entry && typeof entry.index === "number") {
        usedColorIndices.delete(entry.index);
    }
    userColors.delete(login);
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function rgbToHex(r, g, b) {
    return (
        "#" +
        [r, g, b]
            .map((x) => {
                const hex = x.toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            })
            .join("")
    );
}

export function generateColorScheme(baseColor) {
    const [r, g, b] = hexToRgb(baseColor);

    const lighten = (factor) =>
        rgbToHex(
            Math.round(r + (235 - r) * factor),
            Math.round(g + (239 - g) * factor),
            Math.round(b + (240 - b) * factor)
        );

    const darken = (factor) =>
        rgbToHex(
            Math.round(r * (1 - factor)),
            Math.round(g * (1 - factor)),
            Math.round(b * (1 - factor))
        );

    return [
        "#ebedf0",
        lighten(0.6),
        baseColor,
        darken(0.15),
        darken(0.3),
    ];
}

export function setUserColor(login, color) {
    const scheme = generateColorScheme(color);
    const existing = userColors.get(login);

    if (existing && typeof existing === "object" && "index" in existing) {
        userColors.set(login, { scheme, index: existing.index });
    } else {
        userColors.set(login, { scheme, index: -1 });
    }

    return scheme;
}

export const predefinedColors = [
    "#1f77b4",
    "#d62728",
    "#2ca02c",
    "#9467bd",
    "#ff7f0e",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
];

const usedColorIndices = new Set();

export function initializeUserColor(login) {
    if (userColors.has(login)) return;

    let index = 0;
    while (
        usedColorIndices.has(index) ||
        [...userColors.values()].some(entry => entry.base === predefinedColors[index])
        ) {
        index++;
    }

    const baseColor = predefinedColors[index % predefinedColors.length];
    usedColorIndices.add(index);

    const scheme = generateColorScheme(baseColor);
    userColors.set(login, { scheme, index });
}
