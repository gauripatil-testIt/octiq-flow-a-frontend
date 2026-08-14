/** Full-screen loading indicator used as the Suspense fallback in router.tsx. */
export default function PageLoader() {
  return (
    <div
      className="flex h-screen items-center justify-center bg-background"
      role="status"
      aria-label="Loading"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
    </div>
  )
}
