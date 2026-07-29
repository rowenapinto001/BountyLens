import { describe, expect, it } from "vitest";
import { paginate } from "../src/utils/pagination";
import { relativeTimeFromNow } from "../src/utils/dates";

describe("pagination", () => {
  it("handles 0 results", () => {
    const page = paginate([], 1);
    expect(page.items).toHaveLength(0);
    expect(page.totalPages).toBe(1);
  });

  it("handles fewer than 10 results", () => {
    expect(paginate([1, 2, 3], 1).items).toEqual([1, 2, 3]);
  });

  it("handles exactly 10 results", () => {
    expect(paginate(Array.from({ length: 10 }, (_, index) => index), 1).items).toHaveLength(10);
  });

  it("handles more than 10 results", () => {
    const page = paginate(Array.from({ length: 11 }, (_, index) => index), 2);
    expect(page.items).toEqual([10]);
    expect(page.totalPages).toBe(2);
  });
});

describe("relative time formatting", () => {
  const now = Date.parse("2026-07-29T12:00:00Z");

  it("formats recent dates", () => {
    expect(relativeTimeFromNow("2026-07-29T11:55:00Z", now)).toBe("5 minutes ago");
    expect(relativeTimeFromNow("2026-07-29T09:00:00Z", now)).toBe("3 hours ago");
    expect(relativeTimeFromNow("2026-07-27T12:00:00Z", now)).toBe("2 days ago");
  });

  it("formats months and years", () => {
    expect(relativeTimeFromNow("2026-03-31T12:00:00Z", now)).toBe("4 months ago");
    expect(relativeTimeFromNow("2025-07-29T12:00:00Z", now)).toBe("1 year ago");
  });
});
