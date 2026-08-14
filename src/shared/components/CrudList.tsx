import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ConfirmDialog } from './ConfirmDialog'
import { SortIcon } from './SortIcon'

export interface CrudColumn<T> {
  key: keyof T & string
  label: string
  sortable?: boolean
  tooltip?: string
  render?: (value: unknown, item: T) => ReactNode
}

export interface CrudListProps<T extends Record<string, unknown>> {
  entityName: string
  entityNamePlural: string
  resourcePath: string
  primaryKey: keyof T & string
  items: T[]
  loading: boolean
  error: string | null
  onRetry: () => void
  columns: CrudColumn<T>[]
  renderActions?: (item: T) => ReactNode
  renderCell?: (col: CrudColumn<T>, item: T) => ReactNode
  renderTable?: (
    items: T[],
    sortField: string,
    sortDir: string,
    onSortClick: (field: string) => void,
  ) => ReactNode
  onRowClick?: (item: T) => void
  deleteId: string | number | null
  onDeleteRequest: (id: string | number) => void
  onDeleteConfirm: () => void
  onDeleteCancel: () => void
  deleting: boolean
  searchToolbar?: ReactNode
  headerExtra?: ReactNode
  extraSections?: ReactNode
  pageParam: number
  hasNextPage: boolean
  onPrev: () => void
  onNext: () => void
  sortField?: string
  sortDir?: string
  onSortClick?: (field: string) => void
  qParam?: string
}

const noop = (_field: string) => {}

export function CrudList<T extends Record<string, unknown>>({
  entityName,
  entityNamePlural,
  resourcePath,
  primaryKey,
  items,
  loading,
  error,
  onRetry,
  columns,
  renderActions,
  renderCell,
  renderTable,
  onRowClick,
  deleteId,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
  deleting,
  searchToolbar,
  headerExtra,
  extraSections,
  pageParam,
  hasNextPage,
  onPrev,
  onNext,
  sortField = '',
  sortDir = 'asc',
  onSortClick,
  qParam = '',
}: CrudListProps<T>) {
  return (
    <div className="space-y-6">
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {loading
          ? `Loading ${entityNamePlural.toLowerCase()}`
          : error
            ? `Unable to load ${entityNamePlural.toLowerCase()}: ${error}`
            : `${items.length} ${entityNamePlural.toLowerCase()} shown on page ${pageParam}${qParam ? ` for search ${qParam}` : ''}${sortField ? ` sorted by ${sortField} ${sortDir}` : ''}`}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title={`Delete ${entityName}`}
        message={`Are you sure you want to delete this ${entityName.toLowerCase()}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={onDeleteConfirm}
        onCancel={onDeleteCancel}
      />

      <div className="flex flex-wrap items-center justify-end gap-4">
        <Link
          to={`/${resourcePath}/create`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New {entityName}
        </Link>
      </div>

      {headerExtra}
      {searchToolbar}
      {extraSections}

      {loading && (
        <div className="flex items-center justify-center py-16">
          <svg className="h-6 w-6 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="ml-2 text-sm text-foreground/60">Loading…</span>
        </div>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="flex flex-col items-center justify-center rounded-xl border border-error-border bg-error-bg py-16 text-center"
        >
          <svg
            className="mx-auto h-10 w-10 text-error"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p className="mt-3 text-sm font-medium text-error-text">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-lg bg-error px-4 py-2 text-sm font-medium text-white hover:bg-error-hover focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2"
          >
            Try again
          </button>
        </div>
      )}

      {!loading &&
        !error &&
        items.length === 0 &&
        (qParam ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface py-24 text-center">
            <svg
              className="mx-auto h-10 w-10 text-foreground/20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <p className="mt-3 text-sm font-medium text-foreground">
              No results for &ldquo;{qParam}&rdquo;
            </p>
            <p className="mt-1 text-sm text-foreground/50">Try a different search term.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface py-24 text-center">
            <svg
              className="mx-auto h-10 w-10 text-foreground/20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="mt-3 text-sm font-semibold text-foreground">
              No {entityNamePlural.toLowerCase()} yet
            </p>
            <p className="mt-1 text-sm text-foreground/50">
              Get started by creating the first {entityName.toLowerCase()}.
            </p>
            <Link
              to={`/${resourcePath}/create`}
              className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              New {entityName}
            </Link>
          </div>
        ))}

      {!loading &&
        !error &&
        items.length > 0 &&
        renderTable &&
        renderTable(items, sortField, sortDir, onSortClick ?? noop)}

      {!loading && !error && items.length > 0 && !renderTable && (
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed divide-y divide-border">
              <colgroup>
                {columns.map((col) => (
                  <col key={col.key} className="min-w-[8rem]" />
                ))}
                <col className="w-44" />
              </colgroup>
              <thead className="bg-background">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      aria-sort={
                        sortField === col.key
                          ? sortDir === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/60 select-none"
                    >
                      <button
                        type="button"
                        onClick={() => (onSortClick ?? noop)(col.key)}
                        title={col.tooltip}
                        className="group inline-flex items-center gap-1 hover:text-foreground"
                      >
                        <span>{col.label}</span>
                        <SortIcon
                          active={sortField === col.key}
                          direction={(sortField === col.key ? sortDir : 'asc') as 'asc' | 'desc'}
                        />
                      </button>
                    </th>
                  ))}
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-foreground/60"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {items.map((item) => (
                  <tr
                    key={String(item[primaryKey])}
                    className={`hover:bg-background transition-colors${onRowClick ? ' cursor-pointer' : ''}`}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 text-sm text-foreground">
                        {col.render ? (
                          col.render(item[col.key], item)
                        ) : (
                          <span className="block truncate" title={String(item[col.key] ?? '')}>
                            {String(item[col.key] ?? '')}
                          </span>
                        )}
                      </td>
                    ))}
                    <td
                      className="px-6 py-4"
                      onClick={onRowClick ? (e) => e.stopPropagation() : undefined}
                    >
                      {renderActions ? (
                        renderActions(item)
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/${resourcePath}/${String(item[primaryKey])}`}
                            className="rounded-md px-3 py-1.5 text-xs font-medium text-foreground ring-1 ring-border hover:bg-background focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-1"
                          >
                            View
                          </Link>
                          <Link
                            to={`/${resourcePath}/${String(item[primaryKey])}/edit`}
                            className="rounded-md px-3 py-1.5 text-xs font-medium text-primary ring-1 ring-primary-light hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteRequest(item[primaryKey] as string | number)
                            }}
                            className="rounded-md px-3 py-1.5 text-xs font-medium text-error ring-1 ring-error-border hover:bg-error-bg focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-1"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-foreground/60">
          <span>Page {pageParam}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              disabled={pageParam <= 1}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-foreground hover:bg-background disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Previous page"
            >
              &larr; Prev
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!hasNextPage}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-foreground hover:bg-background disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Next page"
            >
              Next &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
