export const ITEMS_PER_PAGE = 10;

export interface PaginationState<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
}

export function paginate<T>(items: T[], requestedPage: number, perPage = ITEMS_PER_PAGE): PaginationState<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const start = (currentPage - 1) * perPage;

  return {
    items: items.slice(start, start + perPage),
    totalPages,
    currentPage
  };
}
