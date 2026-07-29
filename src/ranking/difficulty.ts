import type { GitHubIssue } from "../github/types";
import type { DifficultyResult } from "../types";
import { labelNames, normalizeLabel } from "../utils/labels";
import { BODY_PHRASE_RULES, LABEL_SCORE_RULES } from "./rules";

export function estimateDifficulty(issue: GitHubIssue): DifficultyResult {
  let score = 50;
  const reasons: string[] = [];
  const normalizedLabels = new Set(labelNames(issue.labels).map(normalizeLabel));

  for (const [label, adjustment] of Object.entries(LABEL_SCORE_RULES)) {
    if (normalizedLabels.has(label)) {
      score += adjustment;
      reasons.push(reasonForLabel(label, adjustment));
    }
  }

  const body = issue.body?.trim() ?? "";
  if (!body) {
    score += 12;
    reasons.push("Missing issue description");
  } else if (body.length < 150) {
    score += 8;
    reasons.push("Small issue description");
  } else if (body.length > 4000) {
    score += 13;
    reasons.push("Very detailed issue description");
  } else if (body.length > 1500) {
    score += 5;
    reasons.push("Long issue description");
  }

  if (countChecklistItems(body) >= 3) {
    score -= 5;
    reasons.push("Includes a task checklist");
  }

  const normalizedBody = body.toLowerCase();
  for (const [phrase, adjustment] of Object.entries(BODY_PHRASE_RULES)) {
    if (normalizedBody.includes(phrase)) {
      score += adjustment;
      reasons.push(reasonForBodyPhrase(phrase, adjustment));
    }
  }

  if (issue.comments > 30) {
    score += 15;
    reasons.push("High discussion count");
  } else if (issue.comments >= 16) {
    score += 10;
    reasons.push("Moderate discussion count");
  } else if (issue.comments >= 6) {
    score += 5;
    reasons.push("Some discussion activity");
  }

  const clampedScore = clampScore(score);
  return {
    score: clampedScore,
    difficulty: classifyDifficulty(clampedScore),
    reasons: reasons.slice(0, 4)
  };
}

export function classifyDifficulty(score: number): DifficultyResult["difficulty"] {
  if (score <= 34) {
    return "beginner";
  }
  if (score <= 69) {
    return "intermediate";
  }
  return "advanced";
}

export function clampScore(score: number): number {
  return Math.min(100, Math.max(0, Math.round(score)));
}

function countChecklistItems(body: string): number {
  const matches = body.match(/^\s*[-*]\s+\[[ xX]\]/gm);
  return matches?.length ?? 0;
}

function reasonForLabel(label: string, adjustment: number): string {
  if (label === "good first issue") {
    return "Marked as good first issue";
  }
  if (adjustment < 0) {
    return `Has ${label} label`;
  }
  if (["architecture", "security", "performance", "migration"].includes(label)) {
    return `Mentions ${label} work`;
  }
  return `Has ${label} label`;
}

function reasonForBodyPhrase(phrase: string, adjustment: number): string {
  if (adjustment < 0) {
    return `Includes ${phrase}`;
  }
  return `Mentions ${phrase}`;
}
