interface PaginationProps {
  page: number // 1-based current page
  totalPages: number
  onPrev: () => void
  onNext: () => void
  pageSize?: number
  pageSizeOptions?: number[]
  onPageSizeChange?: (size: number) => void
  totalItems?: number
  className?: string
}

export function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  totalItems,
  className,
}: PaginationProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 text-sm text-foreground/60 ${className ?? ''}`}
    >
      <span>
        Page {page} of {Math.max(1, totalPages)}
        {totalItems !== undefined && ` — ${totalItems} total`}
      </span>
      <div className="flex items-center gap-2">
        {pageSizeOptions && onPageSizeChange && pageSize !== undefined && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label="Rows per page"
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
        )}
        <button
          onClick={onPrev}
          disabled={page <= 1}
          aria-label="Previous page"
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-foreground hover:bg-background disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
        >
          ← Prev
        </button>
        <button
          onClick={onNext}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-foreground hover:bg-background disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
