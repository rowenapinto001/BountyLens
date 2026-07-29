export interface GitHubUser {
  login: string;
  id: number;
  html_url?: string;
  avatar_url?: string;
}

export interface GitHubLabelObject {
  id?: number;
  name?: string;
  color?: string;
  description?: string | null;
}

export type GitHubLabel = string | GitHubLabelObject;

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  url: string;
  repository_url: string;
  state: string;
  labels: GitHubLabel[];
  created_at: string;
  updated_at: string;
  comments: number;
  assignees: GitHubUser[];
  user: GitHubUser;
  body?: string | null;
  pull_request?: unknown;
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: unknown[];
}

export interface GitHubRateLimitInfo {
  limit?: number;
  remaining?: number;
  resetAt?: number;
}

export interface FetchBountyIssuesResult {
  issues: GitHubIssue[];
  totalCount: number;
}
