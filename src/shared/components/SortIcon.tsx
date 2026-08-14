import { cn } from '../../utils/cn'

interface SortIconProps {
  active: boolean
  direction: 'asc' | 'desc'
  className?: string
}

export function SortIcon({ active, direction, className }: SortIconProps) {
  return (
    <svg
      className={cn(
        'h-3.5 w-3.5 shrink-0 transition-colors',
        active ? 'text-primary' : 'text-foreground/30 group-hover:text-foreground/50',
        className,
      )}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      {active && direction === 'desc' ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 9l-4-4-4 4M8 15l4 4 4-4" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
      )}
    </svg>
  )
}
