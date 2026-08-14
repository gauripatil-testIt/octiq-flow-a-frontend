import { type ReactNode } from 'react'
import { cn } from '../../utils/cn'

type ErrorStateVariant = 'page' | 'section' | 'inline'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
  variant?: ErrorStateVariant
  icon?: ReactNode
  className?: string
}

const defaultIcon = (
  <svg
    className="h-10 w-10"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
    />
  </svg>
)

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  retryLabel = 'Try again',
  variant = 'section',
  icon,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center text-center',
        variant === 'page' && 'min-h-[60vh] px-4',
        variant === 'section' && 'py-16 px-4',
        variant === 'inline' && 'rounded-xl border border-error-border bg-error-bg px-4 py-5',
        className,
      )}
    >
      <div className={cn('mb-4 text-error', variant === 'inline' && 'mb-3')}>
        {icon ?? defaultIcon}
      </div>

      <h3
        className={cn(
          'font-semibold text-foreground',
          variant === 'page' ? 'text-xl' : variant === 'section' ? 'text-base' : 'text-sm',
        )}
      >
        {title}
      </h3>

      <p
        className={cn(
          'mt-1.5 text-foreground/60',
          variant === 'page' ? 'text-sm' : 'text-xs',
          'max-w-sm',
        )}
      >
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            'mt-4 inline-flex items-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            variant === 'inline'
              ? 'px-3 py-1.5 text-xs bg-surface border border-border text-foreground hover:bg-background'
              : 'px-4 py-2 text-sm bg-primary text-white hover:bg-primary-hover',
          )}
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          {retryLabel}
        </button>
      )}
    </div>
  )
}
