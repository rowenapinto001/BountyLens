import type { GitHubIssue } from "../github/types";
import type { ExperienceLevel } from "../types";

export interface ExtensionStorage {
  experience?: ExperienceLevel;
  issues?: GitHubIssue[];
  savedIssues?: GitHubIssue[];
  lastSuccessfulFetch?: number;
  currentPage?: number;
  rateLimitResetAt?: number;
  schemaVersion: number;
}
