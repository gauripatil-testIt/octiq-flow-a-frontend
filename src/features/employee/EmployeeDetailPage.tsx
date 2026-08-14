import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { type Employee } from './employeeApi'
import { useEmployeeDetail } from './useEmployeeDetail'
import { EntityDetailSkeleton } from '../../shared/components/EntitySkeleton'
import { ErrorState } from '../../shared/components/ErrorState'
import { formatValue, getStatusColor } from '../../shared/utils/formatters'

export default function EmployeeDetailPage() {
  const navigate = useNavigate()
  const { id, item, loading, error, load } = useEmployeeDetail()

  if (loading) return <EntityDetailSkeleton />
  if (error) return <ErrorState message={error} onRetry={() => load()} />
  if (!item) return null

  return (
    <div className="w-full space-y-5">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground/70 shadow-sm hover:bg-app focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Go back"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-foreground">Employee Details</h2>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/employees/${item.id}/edit`)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </button>
      </div>

      {/* Hero card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="flex items-center gap-6 px-8 py-8">
          {/* Large filled avatar */}
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-primary">
            <svg
              className="h-14 w-14 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          {/* Name + secondary + status */}
          <div>
            <h3 className="text-3xl font-bold text-foreground">{String(item.name ?? '—')}</h3>

            <div className="mt-1.5 flex items-center gap-2 text-sm text-foreground/60">
              <svg
                className="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>

              <span>{String(item.email ?? '—')}</span>
            </div>

            <div className="mt-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusColor(String(item.status ?? ''))}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {String(item.status ?? '—')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Information card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="flex items-center gap-3 border-b border-border px-6 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <svg
              className="h-5 w-5 text-primary"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-foreground">Employee Information</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
          <FieldCard value={item.id} label="Employee ID" isSelect={false} fieldIcon="id" />
          <FieldCard value={item.department} label="Department" isSelect={false} fieldIcon="text" />
          <FieldCard value={item.role} label="Role" isSelect={false} fieldIcon="text" />
          <FieldCard value={item.salary} label="Salary" isSelect={false} fieldIcon="number" />
          <FieldCard
            value={item.joiningDate}
            label="Joining Date"
            isSelect={false}
            fieldIcon="calendar"
          />
          <FieldCard value={item.createdAt} label="Created" isSelect={false} fieldIcon="calendar" />
          <FieldCard value={item.updatedAt} label="Updated" isSelect={false} fieldIcon="calendar" />
        </div>
      </div>
    </div>
  )
}

const FIELD_ICON_PATHS: Record<string, string> = {
  phone:
    'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
  email:
    'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  calendar:
    'M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z',
  tag: 'M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z',
  link: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.71-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',
  number:
    'M9 7v2H7v2h2v6h2v-6h2V9h-2V7H9zm6-4H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V9l-7-6zm5 16H4V5h10v4h5v10z',
  id: 'M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zM4 8h16v2H4V8zm0 4h4v2H4v-2zm4 4H4v-2h4v2zm10 2h-6v-2h6v2zm0-4h-6v-2h6v2z',
  default: 'M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z',
}

function FieldCard({
  value,
  label,
  isSelect,
  fieldIcon,
}: {
  value: unknown
  label: string
  isSelect: boolean
  fieldIcon: string
}) {
  const d = FIELD_ICON_PATHS[fieldIcon] ?? FIELD_ICON_PATHS.default
  return (
    <div className="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <svg
          className="h-5 w-5 text-primary"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d={d} />
        </svg>
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-xs text-foreground/50">{label}</p>
        {isSelect ? (
          <span
            className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${getStatusColor(String(value ?? ''))}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {String(value ?? '—')}
          </span>
        ) : (
          <p className="mt-0.5 text-sm font-semibold text-foreground break-all">
            {formatValue(value)}
          </p>
        )}
      </div>
    </div>
  )
}
