export const BEGINNER_LABELS = ["good first issue", "beginner", "easy", "first-timers-only"] as const;
export const ADVANCED_LABELS = ["hard", "advanced", "expert", "architecture"] as const;

export const LABEL_SCORE_RULES = {
  "good first issue": -30,
  beginner: -25,
  easy: -25,
  "first-timers-only": -30,
  documentation: -15,
  docs: -15,
  "help wanted": -8,
  tests: -5,
  testing: -5,
  frontend: -3,
  ui: -3,
  hard: 25,
  advanced: 25,
  expert: 30,
  architecture: 25,
  security: 20,
  performance: 15,
  infrastructure: 20,
  "breaking change": 20,
  migration: 15,
  database: 10,
  backend: 5,
  refactor: 8
} as const;

export const BODY_PHRASE_RULES = {
  "steps to reproduce": -5,
  "expected behavior": -3,
  "acceptance criteria": -5,
  architecture: 12,
  migration: 10,
  security: 12,
  "breaking change": 15,
  "distributed system": 15,
  "race condition": 15,
  "memory leak": 10,
  performance: 8
} as const;
