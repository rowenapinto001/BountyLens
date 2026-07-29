import { describe, expect, it } from "vitest";
import { calculateExperienceMatch } from "../src/ranking/experienceMatch";
import { issueFixture } from "./fixtures";

const NOW = Date.parse("2026-07-29T00:00:00Z");

describe("experience matching", () => {
  it("scores Student experience", () => {
    const issue = issueFixture({ labels: [{ name: "bounty" }, { name: "good first issue" }] });
    expect(calculateExperienceMatch(issue, "beginner", "student", NOW)).toBe(100);
  });

  it("scores Junior Developer experience", () => {
    expect(calculateExperienceMatch(issueFixture(), "intermediate", "junior", NOW)).toBe(100);
  });

  it("scores Software Engineer experience", () => {
    expect(calculateExperienceMatch(issueFixture(), "advanced", "software-engineer", NOW)).toBe(91);
  });

  it("scores Senior Engineer experience", () => {
    const issue = issueFixture({ labels: [{ name: "bounty" }, { name: "architecture" }] });
    expect(calculateExperienceMatch(issue, "advanced", "senior", NOW)).toBe(100);
  });

  it("penalizes assigned issues", () => {
    const assigned = issueFixture({ assignees: [{ login: "dev", id: 2 }] });
    expect(calculateExperienceMatch(assigned, "intermediate", "junior", NOW)).toBe(88);
  });

  it("penalizes stale issues", () => {
    const stale = issueFixture({ updated_at: "2025-01-01T00:00:00Z" });
    expect(calculateExperienceMatch(stale, "intermediate", "junior", NOW)).toBe(88);
  });
});
