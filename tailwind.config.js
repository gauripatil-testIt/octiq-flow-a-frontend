/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // class strategy: ThemeProvider toggles class="dark" on <html>
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ── Primary ─────────────────────────────────────────── */
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          light: 'var(--color-primary-light)',
          foreground: 'var(--color-text-inverse)', // text on primary bg
        },
        /* ── Surface & layout ────────────────────────────────── */
        surface: 'var(--color-surface)',
        app: 'var(--color-background)', // kept for backward compatibility
        background: 'var(--color-background)',
        border: 'var(--color-border)',
        'row-hover': 'var(--color-row-hover)',
        overlay: 'var(--color-overlay)',
        /* ── Semantic text aliases (spec: text-foreground, text-muted-foreground) */
        foreground: 'var(--color-text-primary)',
        'muted-foreground': 'var(--color-text-secondary)',
        /* ── Card surface (spec: bg-card text-card-foreground) */
        card: {
          DEFAULT: 'var(--color-surface)',
          foreground: 'var(--color-text-primary)',
        },
        /* ── Text ────────────────────────────────────────────── */
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          inverse: 'var(--color-text-inverse)',
          muted: 'var(--color-text-secondary)',
        },
        /* ── Sidebar ─────────────────────────────────────────── */
        sidebar: {
          DEFAULT: 'var(--color-sidebar)',
          hover: 'var(--color-sidebar-hover)',
          text: 'var(--color-sidebar-text)',
          border: 'var(--color-sidebar-border)',
          active: 'var(--color-sidebar-active)',
        },
        /* ── Input (spec: bg-input, ring-ring) ───────────────── */
        input: {
          DEFAULT: 'var(--color-input-bg)',
          border: 'var(--color-input-border)',
          focus: 'var(--color-input-focus)',
        },
        ring: 'var(--color-primary)',
        /* ── Error ───────────────────────────────────────────── */
        error: {
          DEFAULT: 'var(--color-error)',
          hover: 'var(--color-error-hover)',
          bg: 'var(--color-error-bg)',
          border: 'var(--color-error-border)',
          text: 'var(--color-error-text)',
        },
        /* ── Success ─────────────────────────────────────────── */
        success: {
          DEFAULT: 'var(--color-success)',
          bg: 'var(--color-success-bg)',
        },
        /* ── Warning ─────────────────────────────────────────── */
        warning: {
          DEFAULT: 'var(--color-warning)',
          bg: 'var(--color-warning-bg)',
        },
      },
      /* ── Spacing tokens ──────────────────────────────────────── */
      spacing: {
        sidebar: 'var(--sidebar-width)',
        header: 'var(--header-height)',
        'content-padding': 'var(--content-padding)',
      },
      /* ── Border radius ───────────────────────────────────────── */
      borderRadius: {
        DEFAULT: 'var(--border-radius)',
        token: 'var(--border-radius)',
      },
      /* ── Typography ──────────────────────────────────────────── */
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      /* ── Component sizing ────────────────────────────────────── */
      height: {
        'table-row': 'var(--table-row-height)',
        header: 'var(--header-height)',
      },
      maxHeight: {
        table: 'var(--table-max-height)',
      },
      width: {
        sidebar: 'var(--sidebar-width)',
      },
    },
  },
  plugins: [],
}
