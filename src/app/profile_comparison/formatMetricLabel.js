const singularLabels = {
    repos: "Repository",
    contributions: "Contribution",
    commits: "Commit",
    prs: "Pull Request",
    issues: "Issue",
    stars: "Star",
    forks: "Fork",
};

export function formatMetricLabel(value, key) {
    const base = singularLabels[key] ?? key;
    return `${value} ${value === 1 ? base : base + "s"}`;
}