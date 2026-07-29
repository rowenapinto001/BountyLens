import { AppError, toRateLimitInfo } from "../utils/errors";
import { buildBountySearchUrl } from "./queries";
import type { FetchBountyIssuesResult } from "./types";
import { parseSearchResponse, validateIssueList } from "./validation";

export async function fetchBountyIssues(signal?: AbortSignal): Promise<FetchBountyIssuesResult> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new AppError("offline", "The browser is offline.");
  }

  const response = await fetch(buildBountySearchUrl(1), {
    signal,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  if (response.status === 403 && response.headers.get("x-ratelimit-remaining") === "0") {
    throw new AppError("rate-limit", "GitHub API rate limit reached.", toRateLimitInfo(response.headers));
  }

  if (!response.ok) {
    throw new AppError("github", `GitHub returned ${response.status}.`, toRateLimitInfo(response.headers));
  }

  const data: unknown = await response.json();
  const parsed = parseSearchResponse(data);

  if (!parsed) {
    throw new AppError("malformed", "GitHub returned an unexpected response shape.");
  }

  return {
    totalCount: parsed.total_count,
    issues: validateIssueList(parsed.items)
  };
}
