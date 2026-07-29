import type { GitHubIssue, GitHubLabel } from "../github/types";

export function getLabelName(label: GitHubLabel): string {
  return typeof label === "string" ? label : label.name ?? "";
}

export function normalizeLabel(label: string): string {
  return label.trim().toLowerCase();
}

export function hasExactBountyLabel(issue: Pick<GitHubIssue, "labels">): boolean {
  return issue.labels.some((label) => normalizeLabel(getLabelName(label)) === "bounty");
}

export function hasAnyLabel(labels: GitHubLabel[], labelNames: readonly string[]): boolean {
  const normalizedNames = new Set(labelNames.map(normalizeLabel));
  return labels.some((label) => normalizedNames.has(normalizeLabel(getLabelName(label))));
}

export function labelNames(labels: GitHubLabel[]): string[] {
  return labels.map(getLabelName).map((name) => name.trim()).filter(Boolean);
}
