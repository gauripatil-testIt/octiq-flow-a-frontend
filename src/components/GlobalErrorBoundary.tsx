import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  resetKey: number
}

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export class GlobalErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, resetKey: 0 }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('GlobalErrorBoundary caught an error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4">
          <div
            role="alert"
            className="max-w-md w-full rounded-xl border border-error/20 bg-error/10 p-6 shadow-md"
          >
            <h2 className="text-xl font-semibold text-error mb-3">Something went wrong</h2>
            <p className="text-sm text-error/80 mb-4">
              An unexpected error occurred. Please try again or contact support if the problem
              persists.
            </p>
            <button
              type="button"
              className="rounded-lg bg-error/10 border border-error/20 px-4 py-2 text-sm font-medium text-error hover:bg-error/20 transition-colors"
              onClick={() =>
                this.setState((s) => ({ hasError: false, error: null, resetKey: s.resetKey + 1 }))
              }
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    // resetKey change forces children to unmount+remount, clearing their error state
    return <React.Fragment key={this.state.resetKey}>{this.props.children}</React.Fragment>
  }
}

export function withErrorBoundary<P extends object>(Component: React.ComponentType<P>) {
  return function WrappedWithBoundary(props: P) {
    return (
      <GlobalErrorBoundary>
        <Component {...props} />
      </GlobalErrorBoundary>
    )
  }
}
