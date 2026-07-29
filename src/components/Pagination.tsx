import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pageItems = getPageItems(currentPage, totalPages);

  return (
    <nav className="pagination" aria-label="Results pagination">
      <button
        className="pagination-arrow"
        type="button"
        aria-label="Go to previous page"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </button>
      <div className="page-number-group" aria-label={`Page ${currentPage} of ${totalPages}`}>
        {pageItems.map((item, index) =>
          item === "ellipsis" ? (
            <span className="page-ellipsis" aria-hidden="true" key={`ellipsis-${index}`}>...</span>
          ) : (
            <button
              className={`page-number ${item === currentPage ? "is-current" : ""}`}
              type="button"
              aria-label={`Go to page ${item}`}
              aria-current={item === currentPage ? "page" : undefined}
              key={item}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          )
        )}
      </div>
      <button
        className="pagination-arrow"
        type="button"
        aria-label="Go to next page"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}

type PageItem = number | "ellipsis";

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}
