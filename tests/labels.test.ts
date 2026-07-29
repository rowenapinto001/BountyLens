import { describe, expect, it } from "vitest";
import { hasExactBountyLabel } from "../src/utils/labels";
import { extractRepositoryName } from "../src/utils/repository";
import { validateIssueList } from "../src/github/validation";
import { issueFixture } from "./fixtures";

describe("label matching", () => {
  it("matches exact bounty labels", () => {
    expect(hasExactBountyLabel(issueFixture({ labels: [{ name: "bounty" }] }))).toBe(true);
  });

  it("matches bounty case-insensitively", () => {
    expect(hasExactBountyLabel(issueFixture({ labels: [{ name: "BOUNTY" }] }))).toBe(true);
  });

  it("rejects labels that contain bounty but are not exact", () => {
    expect(hasExactBountyLabel(issueFixture({ labels: [{ name: "bug-bounty" }] }))).toBe(false);
    expect(hasExactBountyLabel(issueFixture({ labels: [{ name: "bounty available" }] }))).toBe(false);
  });
});

describe("repository extraction and validation", () => {
  it("extracts owner and repository name", () => {
    expect(extractRepositoryName("https://api.github.com/repos/facebook/react")).toBe("facebook/react");
  });

  it("removes duplicate issue IDs", () => {
    const issues = validateIssueList([
      issueFixture({ id: 9 }),
      issueFixture({ id: 9, number: 10 }),
      issueFixture({ id: 10 })
    ]);

    expect(issues).toHaveLength(2);
  });
});
