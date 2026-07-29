import type { GitHubRateLimitInfo } from "../github/types";

export type AppErrorKind = "offline" | "rate-limit" | "github" | "malformed" | "unknown";

export class AppError extends Error {
  constructor(
    public readonly kind: AppErrorKind,
    message: string,
    public readonly rateLimit?: GitHubRateLimitInfo
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function toRateLimitInfo(headers: Headers): GitHubRateLimitInfo {
  const limit = parseIntegerHeader(headers, "x-ratelimit-limit");
  const remaining = parseIntegerHeader(headers, "x-ratelimit-remaining");
  const resetSeconds = parseIntegerHeader(headers, "x-ratelimit-reset");

  return {
    limit,
    remaining,
    resetAt: typeof resetSeconds === "number" ? resetSeconds * 1000 : undefined
  };
}

function parseIntegerHeader(headers: Headers, header: string): number | undefined {
  const value = headers.get(header);
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}
