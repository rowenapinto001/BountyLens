export const GITHUB_SEARCH_ENDPOINT = "https://api.github.com/search/issues";
export const BOUNTY_QUERY = "is:issue is:open label:bounty";
export const GITHUB_PER_PAGE = 100;

export function buildBountySearchUrl(page = 1): string {
  const params = new URLSearchParams({
    q: BOUNTY_QUERY,
    sort: "updated",
    order: "desc",
    per_page: String(GITHUB_PER_PAGE),
    page: String(page)
  });

  return `${GITHUB_SEARCH_ENDPOINT}?${params.toString()}`;
}
