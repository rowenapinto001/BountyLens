import type { GitHubIssue } from "../github/types";
import type { DifficultyResult, ExperienceLevel, MatchQuality } from "../types";
import { estimateDifficulty } from "./difficulty";
import { calculateExperienceMatch } from "./experienceMatch";

export interface RankedIssue {
  issue: GitHubIssue;
  difficulty: DifficultyResult;
  matchScore: number;
  matchQuality: MatchQuality;
}

export function rankIssues(issues: GitHubIssue[], experience: ExperienceLevel, now = Date.now()): RankedIssue[] {
  return dedupeIssues(issues)
    .map((issue) => {
      const difficulty = estimateDifficulty(issue);
      const matchScore = calculateExperienceMatch(issue, difficulty.difficulty, experience, now);
      return {
        issue,
        difficulty,
        matchScore,
        matchQuality: getMatchQuality(matchScore)
      };
    })
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }

      const aAssigned = a.issue.assignees.length > 0;
      const bAssigned = b.issue.assignees.length > 0;
      if (aAssigned !== bAssigned) {
        return aAssigned ? 1 : -1;
      }

      const updatedDiff = new Date(b.issue.updated_at).getTime() - new Date(a.issue.updated_at).getTime();
      if (updatedDiff !== 0) {
        return updatedDiff;
      }

      return a.issue.comments - b.issue.comments;
    });
}

export function dedupeIssues(issues: GitHubIssue[]): GitHubIssue[] {
  const seenIds = new Set<number>();
  return issues.filter((issue) => {
    if (seenIds.has(issue.id)) {
      return false;
    }
    seenIds.add(issue.id);
    return true;
  });
}

function getMatchQuality(score: number): MatchQuality {
  if (score >= 85) {
    return "Strong match";
  }
  if (score >= 65) {
    return "Good match";
  }
  if (score >= 40) {
    return "Possible match";
  }
  return "Stretch issue";
}
