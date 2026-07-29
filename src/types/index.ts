export type ExperienceLevel = "student" | "junior" | "software-engineer" | "senior";

export type ThemeMode = "light" | "dark";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface DifficultyResult {
  difficulty: Difficulty;
  score: number;
  reasons: string[];
}

export type MatchQuality = "Strong match" | "Good match" | "Possible match" | "Stretch issue";
