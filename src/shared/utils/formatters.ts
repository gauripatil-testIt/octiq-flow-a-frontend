export function formatValue(value: unknown): string {
  const s = String(value ?? '')
  if (!s || s === 'null' || s === 'undefined') return '—'
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)) {
    try {
      return new Date(s).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      /* fall through */
    }
  }
  return s
}

export function getStatusColor(status: string): string {
  const s = status.toUpperCase()
  if (['ACTIVE', 'AVAILABLE', 'PAID', 'RESOLVED', 'COMPLETED', 'DONE', 'APPROVED'].includes(s))
    return 'bg-green-100 text-green-700'
  if (['INACTIVE', 'ENDED', 'TERMINATED', 'FAILED', 'CLOSED', 'REJECTED', 'CANCELLED'].includes(s))
    return 'bg-red-100 text-red-700'
  if (['PENDING', 'OPEN', 'UNDER_MAINTENANCE', 'IN_PROGRESS', 'PROCESSING'].includes(s))
    return 'bg-yellow-100 text-yellow-700'
  return 'bg-blue-100 text-blue-700'
}

export function normalizeApiRecord(record: Record<string, unknown>): Record<string, unknown> {
  const out = { ...record }
  for (const key of Object.keys(out)) {
    if (out[key] === null) out[key] = ''
  }
  return out
}
