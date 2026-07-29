import type { GitHubIssue } from "../src/github/types";

export function issueFixture(overrides: Partial<GitHubIssue> = {}): GitHubIssue {
  return {
    id: 1,
    number: 42,
    title: "Fix accessible bounty issue",
    html_url: "https://github.com/example/project/issues/42",
    url: "https://api.github.com/repos/example/project/issues/42",
    repository_url: "https://api.github.com/repos/example/project",
    state: "open",
    labels: [{ name: "bounty" }],
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-07-28T00:00:00Z",
    comments: 0,
    assignees: [],
    user: { login: "octo", id: 100 },
    body: "Steps to reproduce are clear. Expected behavior is documented.",
    ...overrides
  };
}
