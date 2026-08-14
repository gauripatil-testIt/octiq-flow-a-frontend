import { useLocation } from 'react-router-dom'

interface HeaderProps {
  onMenuClick: () => void
}

const routeLabels: Record<string, string> = {
  '/employees': 'Employees',
}

function getPageTitle(pathname: string): string {
  const base = '/' + pathname.split('/')[1]
  const sub = pathname.split('/')[2]
  const label = routeLabels[base]
  if (!label) return 'Octiq Enterprise — Flow A: Employee Management UI'
  if (!sub) return label
  if (sub === 'new' || sub === 'create') return `New ${label.slice(0, -1)}`
  return `Edit ${label.slice(0, -1)}`
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Header({ onMenuClick }: HeaderProps) {
  const { pathname } = useLocation()
  const title = getPageTitle(pathname)
  return (
    <header className="flex h-16 items-center gap-4 border-b border-border bg-surface shadow-sm px-4 sm:px-6">
      {/* Mobile sidebar toggle */}
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-md p-2 text-text-secondary hover:bg-background hover:text-foreground lg:hidden"
        aria-label="Open menu"
        aria-controls="main-content"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <h1 className="flex-1 text-lg font-semibold text-foreground">{title}</h1>
    </header>
  )
}
