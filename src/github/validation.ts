import type { GitHubIssue, GitHubLabel, GitHubSearchResponse, GitHubUser } from "./types";
import { hasExactBountyLabel } from "../utils/labels";

export function parseSearchResponse(data: unknown): GitHubSearchResponse | null {
  if (!isRecord(data) || !Array.isArray(data.items)) {
    return null;
  }

  return {
    total_count: typeof data.total_count === "number" ? data.total_count : data.items.length,
    incomplete_results: typeof data.incomplete_results === "boolean" ? data.incomplete_results : false,
    items: data.items
  };
}

export function validateGitHubIssue(value: unknown): GitHubIssue | null {
  if (!isRecord(value) || "pull_request" in value) {
    return null;
  }

  if (
    typeof value.id !== "number" ||
    typeof value.number !== "number" ||
    typeof value.title !== "string" ||
    value.title.trim().length === 0 ||
    typeof value.html_url !== "string" ||
    value.html_url.trim().length === 0 ||
    typeof value.url !== "string" ||
    typeof value.repository_url !== "string" ||
    typeof value.state !== "string" ||
    !Array.isArray(value.labels) ||
    typeof value.created_at !== "string" ||
    typeof value.updated_at !== "string" ||
    typeof value.comments !== "number" ||
    !Array.isArray(value.assignees) ||
    !isGitHubUser(value.user)
  ) {
    return null;
  }

  const labels = value.labels.filter(isGitHubLabel);
  const assignees = value.assignees.filter(isGitHubUser);
  const issue: GitHubIssue = {
    id: value.id,
    number: value.number,
    title: value.title,
    html_url: value.html_url,
    url: value.url,
    repository_url: value.repository_url,
    state: value.state,
    labels,
    created_at: value.created_at,
    updated_at: value.updated_at,
    comments: value.comments,
    assignees,
    user: value.user,
    body: typeof value.body === "string" || value.body === null ? value.body : undefined
  };

  return hasExactBountyLabel(issue) ? issue : null;
}

export function validateIssueList(items: unknown[]): GitHubIssue[] {
  const seenIds = new Set<number>();
  const issues: GitHubIssue[] = [];

  for (const item of items) {
    const issue = validateGitHubIssue(item);
    if (issue && !seenIds.has(issue.id)) {
      seenIds.add(issue.id);
      issues.push(issue);
    }
  }

  return issues;
}

function isGitHubLabel(value: unknown): value is GitHubLabel {
  if (typeof value === "string") {
    return true;
  }

  return isRecord(value) && (typeof value.name === "string" || value.name === undefined);
}

function isGitHubUser(value: unknown): value is GitHubUser {
  return (
    isRecord(value) &&
    typeof value.login === "string" &&
    typeof value.id === "number" &&
    (typeof value.html_url === "string" || value.html_url === undefined) &&
    (typeof value.avatar_url === "string" || value.avatar_url === undefined)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
