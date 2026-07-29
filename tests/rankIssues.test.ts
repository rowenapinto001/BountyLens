import { describe, expect, it } from "vitest";
import { rankIssues } from "../src/ranking/rankIssues";
import { issueFixture } from "./fixtures";

const NOW = Date.parse("2026-07-29T00:00:00Z");

describe("rankIssues", () => {
  it("sorts bounty issues by ascending comment count before pagination", () => {
    const ranked = rankIssues(
      [
        issueFixture({ id: 1, number: 1, comments: 24 }),
        issueFixture({ id: 2, number: 2, comments: 0 }),
        issueFixture({ id: 3, number: 3, comments: 7 }),
        issueFixture({ id: 4, number: 4, comments: 1 })
      ],
      "software-engineer",
      NOW
    );

    expect(ranked.map(({ issue }) => issue.comments)).toEqual([0, 1, 7, 24]);
  });

  it("uses match score as a tie-breaker when comment counts match", () => {
    const ranked = rankIssues(
      [
        issueFixture({ id: 1, number: 1, comments: 3, labels: [{ name: "bounty" }, { name: "documentation" }] }),
        issueFixture({ id: 2, number: 2, comments: 3, labels: [{ name: "bounty" }, { name: "architecture" }] })
      ],
      "senior",
      NOW
    );

    expect(ranked[0].issue.number).toBe(2);
  });
});
