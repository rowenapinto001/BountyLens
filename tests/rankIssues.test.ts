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

describe("owner spreading", () => {
  const repo = (owner: string) => `https://api.github.com/repos/${owner}/project`;

  it("stops one owner from taking the whole first page", () => {
    // The sort leads on ascending comments, so an org filing many zero-comment
    // bounty issues at once would otherwise occupy every slot. Observed live:
    // nine of the first ten results from a single owner.
    const ranked = rankIssues(
      [
        ...Array.from({ length: 9 }, (_, i) =>
          issueFixture({ id: i + 1, number: i + 1, comments: 0, repository_url: repo("bulk-org") })
        ),
        issueFixture({ id: 90, number: 90, comments: 0, repository_url: repo("other-org") }),
        issueFixture({ id: 91, number: 91, comments: 0, repository_url: repo("third-org") })
      ],
      "software-engineer",
      NOW
    );

    const owners = ranked.slice(0, 3).map(({ issue }) => issue.repository_url.split("/")[4]);
    expect(new Set(owners).size).toBe(3);
  });

  it("leaves a single-owner list in its ranked order", () => {
    const ranked = rankIssues(
      [
        issueFixture({ id: 1, number: 1, comments: 12, repository_url: repo("solo") }),
        issueFixture({ id: 2, number: 2, comments: 0, repository_url: repo("solo") }),
        issueFixture({ id: 3, number: 3, comments: 4, repository_url: repo("solo") })
      ],
      "software-engineer",
      NOW
    );

    expect(ranked.map(({ issue }) => issue.comments)).toEqual([0, 4, 12]);
  });
});
