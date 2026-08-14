import { Toaster as SonnerToaster } from 'sonner'

/**
 * Toaster — app-level toast container powered by Sonner.
 *
 * Mount once in App.tsx (already done). Consume via the toast() helper:
 *   import { toast } from 'sonner'
 *   toast.success('Saved!')
 *   toast.error('Something went wrong.')
 *   toast.promise(apiCall(), { loading: 'Saving…', success: 'Done', error: 'Failed' })
 */
const toastStyle = {
  background: 'var(--color-surface)',
  color: 'var(--color-text-primary)',
  border: '1px solid var(--color-border)',
}
const sonnerOptions = { style: toastStyle }

// Change TOAST_POSITION to reposition notifications project-wide.
// Valid: top-left | top-center | top-right | bottom-left | bottom-center | bottom-right
const TOAST_POSITION = 'top-right' as const

export function Toaster() {
  return (
    <SonnerToaster position={TOAST_POSITION} richColors closeButton toastOptions={sonnerOptions} />
  )
}

// Re-export toast helper so consumers import from one place
export { toast } from 'sonner'
