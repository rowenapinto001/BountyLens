import type { GitHubIssue } from "../github/types";
import type { ExperienceLevel, ThemeMode } from "../types";

export interface ExtensionStorage {
  experience?: ExperienceLevel;
  theme?: ThemeMode;
  issues?: GitHubIssue[];
  savedIssues?: GitHubIssue[];
  lastSuccessfulFetch?: number;
  currentPage?: number;
  rateLimitResetAt?: number;
  schemaVersion: number;
}
