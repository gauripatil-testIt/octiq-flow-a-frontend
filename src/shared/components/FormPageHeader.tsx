import { Link } from 'react-router-dom'

interface FormPageHeaderProps {
  backHref: string
  backLabel: string
  subtitle: string
  serverError?: string | null
}

export function FormPageHeader({
  backHref,
  backLabel,
  subtitle,
  serverError,
}: FormPageHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-3">
        <Link
          to={backHref}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-foreground/60 shadow-sm hover:bg-background hover:text-foreground transition-colors"
          aria-label={backLabel}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <p className="text-sm text-foreground/60">{subtitle}</p>
      </div>
      {serverError && (
        <div
          className="flex items-center gap-3 rounded-lg border border-error-border bg-error-bg px-4 py-3 text-sm text-error-text"
          role="alert"
        >
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          {serverError}
        </div>
      )}
    </>
  )
}
