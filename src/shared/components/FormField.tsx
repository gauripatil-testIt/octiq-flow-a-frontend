import { type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Tooltip } from './ui/Tooltip'

interface FormFieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  hint?: string
  children: ReactNode
  className?: string
  tooltip?: string
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className,
  tooltip,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-sm font-medium text-foreground"
      >
        <span>
          {label}
          {required && (
            <span className="ml-0.5 text-error" aria-hidden="true">
              *
            </span>
          )}
        </span>
        {tooltip && (
          <Tooltip content={tooltip}>
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-border text-[10px] text-foreground/60"
              aria-label={`${label} help`}
            >
              ?
            </span>
          </Tooltip>
        )}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-error" role="alert">
          <svg
            className="h-3.5 w-3.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && <p className="text-xs text-foreground/50">{hint}</p>}
    </div>
  )
}
