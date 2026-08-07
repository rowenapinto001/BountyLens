import type { GitHubIssue } from "../github/types";
import type { DifficultyResult, ExperienceLevel, MatchQuality } from "../types";
import { estimateDifficulty } from "./difficulty";
import { calculateExperienceMatch } from "./experienceMatch";
import { extractRepositoryName } from "../utils/repository";

export interface RankedIssue {
  issue: GitHubIssue;
  difficulty: DifficultyResult;
  matchScore: number;
  matchQuality: MatchQuality;
}

export function rankIssues(issues: GitHubIssue[], experience: ExperienceLevel, now = Date.now()): RankedIssue[] {
  return spreadAcrossOwners(rankByFit(issues, experience, now));
}

function rankByFit(issues: GitHubIssue[], experience: ExperienceLevel, now: number): RankedIssue[] {
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
      if (a.issue.comments !== b.issue.comments) {
        return a.issue.comments - b.issue.comments;
      }

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

      return a.issue.number - b.issue.number;
    });
}

/**
 * Round-robin the ranked list across repository owners.
 *
 * The sort leads on ascending comment count, so an org that files many
 * bounty-labelled issues at once, all sitting at zero comments, takes the
 * entire first page. Observed live: nine of the first ten results from a
 * single owner, which makes the list look broken and buries everything else.
 *
 * Relative order within an owner is preserved, and owners are visited in the
 * order their best-ranked issue appeared, so the top result is still the top
 * result. With a single owner this is the identity function.
 */
export function spreadAcrossOwners(ranked: RankedIssue[]): RankedIssue[] {
  const byOwner = new Map<string, RankedIssue[]>();
  for (const entry of ranked) {
    const owner = extractRepositoryName(entry.issue.repository_url).split("/")[0];
    const bucket = byOwner.get(owner);
    if (bucket) bucket.push(entry);
    else byOwner.set(owner, [entry]);
  }

  if (byOwner.size < 2) {
    return ranked;
  }

  const queues = [...byOwner.values()];
  const spread: RankedIssue[] = [];
  for (let round = 0; spread.length < ranked.length; round++) {
    for (const queue of queues) {
      if (round < queue.length) spread.push(queue[round]);
    }
  }
  return spread;
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
