/**
 * ThemeContext — runtime dark-mode system
 *
 * Strategy : class-based (toggles class="dark" on <html>)
 * Modes    : "system" | "light" | "dark"
 * Default  : "system" (follows OS preference)
 * Storage  : localStorage key "ui-theme"
 * API      : useTheme() → { theme, effectiveTheme, setTheme }
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type ThemeMode = 'system' | 'light' | 'dark'
export type EffectiveTheme = 'light' | 'dark'

const STORAGE_KEY = 'ui-theme'

export interface ThemeContextValue {
  /** User-selected mode (may be "system"). */
  theme: ThemeMode
  /** Resolved theme after applying system preference. */
  effectiveTheme: EffectiveTheme
  /** Update the theme, persist to localStorage, and flip the DOM class. */
  setTheme: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

// ── Helpers ───────────────────────────────────────────────────────────────────

function resolveEffective(mode: ThemeMode): EffectiveTheme {
  if (mode !== 'system') return mode
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyClass(mode: ThemeMode): void {
  const root = document.documentElement
  if (resolveEffective(mode) === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

function readStorage(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    /* storage blocked */
  }
  return 'system'
}

function writeStorage(mode: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    /* storage blocked */
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

interface ThemeProviderProps {
  children: ReactNode
  /** Overrides the default mode when no stored preference exists. */
  defaultTheme?: ThemeMode
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const stored = readStorage()
    return stored !== 'system' ? stored : defaultTheme
  })

  const [effectiveTheme, setEffective] = useState<EffectiveTheme>(() => resolveEffective(theme))

  useEffect(() => {
    applyClass(theme)
    setEffective(resolveEffective(theme))

    // When mode is "system", listen for OS-level preference changes.
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onSystemChange = () => {
      applyClass('system')
      setEffective(resolveEffective('system'))
    }
    mq.addEventListener('change', onSystemChange)
    return () => mq.removeEventListener('change', onSystemChange)
  }, [theme])

  const setTheme = (mode: ThemeMode) => {
    writeStorage(mode)
    setThemeState(mode)
  }

  const ctxValue: ThemeContextValue = { theme, effectiveTheme, setTheme }
  return <ThemeContext.Provider value={ctxValue}>{children}</ThemeContext.Provider>
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * useTheme() — consume the runtime theme context.
 *
 * @example
 * const { theme, setTheme } = useTheme()
 * <button onClick={() => setTheme('dark')}>Dark</button>
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme() must be called inside <ThemeProvider>')
  return ctx
}
