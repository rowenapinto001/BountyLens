import type { GitHubIssue } from "../github/types";
import type { Difficulty, ExperienceLevel } from "../types";
import { hasAnyLabel } from "../utils/labels";
import { ADVANCED_LABELS, BEGINNER_LABELS } from "./rules";

const BASE_MATCH: Record<ExperienceLevel, Record<Difficulty, number>> = {
  student: {
    beginner: 100,
    intermediate: 55,
    advanced: 15
  },
  junior: {
    beginner: 85,
    intermediate: 100,
    advanced: 40
  },
  "software-engineer": {
    beginner: 60,
    intermediate: 100,
    advanced: 75
  },
  senior: {
    beginner: 40,
    intermediate: 80,
    advanced: 100
  }
};

export function calculateExperienceMatch(
  issue: GitHubIssue,
  difficulty: Difficulty,
  experience: ExperienceLevel,
  now = Date.now()
): number {
  let score = BASE_MATCH[experience][difficulty];

  score += issue.assignees.length > 0 ? -20 : 8;

  const updatedAt = new Date(issue.updated_at).getTime();
  const daysSinceUpdate = Math.floor((now - updatedAt) / 86_400_000);

  if (daysSinceUpdate <= 7) {
    score += 8;
  } else if (daysSinceUpdate <= 30) {
    score += 4;
  } else if (daysSinceUpdate > 365) {
    score -= 20;
  } else if (daysSinceUpdate > 180) {
    score -= 10;
  }

  if (issue.comments > 30) {
    score -= 5;
  }

  if (experience === "student" && hasAnyLabel(issue.labels, BEGINNER_LABELS)) {
    score += 5;
  }

  if (experience === "senior" && hasAnyLabel(issue.labels, ADVANCED_LABELS)) {
    score += 5;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}
