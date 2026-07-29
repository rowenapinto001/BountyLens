import { describe, expect, it } from "vitest";
import { classifyDifficulty, estimateDifficulty } from "../src/ranking/difficulty";
import { issueFixture } from "./fixtures";

describe("difficulty estimation", () => {
  it("clamps low difficulty scores", () => {
    const result = estimateDifficulty(issueFixture({ labels: [{ name: "bounty" }, { name: "good first issue" }, { name: "first-timers-only" }] }));
    expect(result.score).toBe(0);
    expect(result.difficulty).toBe("beginner");
  });

  it("clamps high difficulty scores", () => {
    const result = estimateDifficulty(
      issueFixture({
        labels: [{ name: "bounty" }, { name: "expert" }, { name: "architecture" }, { name: "security" }, { name: "breaking change" }],
        body: "architecture migration security breaking change distributed system race condition memory leak performance",
        comments: 45
      })
    );
    expect(result.score).toBe(100);
    expect(result.difficulty).toBe("advanced");
  });

  it("classifies beginner, intermediate and advanced scores", () => {
    expect(classifyDifficulty(34)).toBe("beginner");
    expect(classifyDifficulty(35)).toBe("intermediate");
    expect(classifyDifficulty(70)).toBe("advanced");
  });
});
