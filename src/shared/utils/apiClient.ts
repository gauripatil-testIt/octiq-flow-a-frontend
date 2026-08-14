/**
 * Shared HTTP client — generic request infrastructure used by all entity API modules.
 * Auth headers, mock flags, and entity-specific parsing stay in each entity's API file.
 */

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

/** Strip empty strings so optional fields are omitted (backend rejects ""). */
export function toApiBody<T extends Record<string, unknown>>(data: T): T {
  const body = { ...data }
  for (const [key, value] of Object.entries(body)) {
    if (value === '') delete body[key]
  }
  return body
}

export async function request<T>(
  path: string,
  init: RequestInit = {},
  parse: (value: unknown) => T,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  }

  const res = await fetch(path, { ...init, headers })

  if (res.status === 204) return undefined as T

  if (!res.ok) {
    let msg = `Request failed: ${res.status} ${res.statusText}`
    try {
      const body = await res.json()
      msg = body?.message ?? body?.detail ?? body?.title ?? msg
    } catch {
      // ignore parse errors — use the default message
    }
    throw new Error(msg)
  }

  return parse(await res.json())
}
