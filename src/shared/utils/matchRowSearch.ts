/**
 * Shared list/search matching for client-side mock APIs.
 * - Enum fields: exact or prefix match — never substring ("active" ≠ "inactive").
 * - Id fields: numeric equality for plain numeric queries (not date-shaped).
 * - Date fields: tiered match — full dates are exact YYYY-MM-DD per field only.
 * - Other text: case-insensitive substring.
 */

export type SearchFieldRule =
  { kind: 'text' } | { kind: 'id' } | { kind: 'date' } | { kind: 'enum'; values: readonly string[] }

export type RowSearchConfig = Record<string, SearchFieldRule>

const DATE_FIELD_KEY = /(?:created|updated|scheduled|deleted|published)at$|date$/i

export function isDateFieldKey(key: string): boolean {
  return DATE_FIELD_KEY.test(key)
}

function dateDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Normalize user date input to ISO prefix (YYYY, YYYY-MM, or YYYY-MM-DD).
 */
export function normalizeDateQuery(rawQuery: string): string | null {
  const q = rawQuery.trim()
  if (!q) return null

  const isoFull = q.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/)
  if (isoFull) {
    return `${isoFull[1]}-${isoFull[2].padStart(2, '0')}-${isoFull[3].padStart(2, '0')}`
  }

  const isoYearMonth = q.match(/^(\d{4})[-/](\d{1,2})$/)
  if (isoYearMonth) {
    return `${isoYearMonth[1]}-${isoYearMonth[2].padStart(2, '0')}`
  }

  const yearOnly = q.match(/^(\d{4})$/)
  if (yearOnly) return yearOnly[1]

  const usFull = q.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/)
  if (usFull) {
    return `${usFull[3]}-${usFull[1].padStart(2, '0')}-${usFull[2].padStart(2, '0')}`
  }

  const digits = dateDigits(q)
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`
  }

  return null
}

type ParsedDateQuery =
  | { kind: 'full'; iso: string }
  | { kind: 'yearMonth'; iso: string }
  | { kind: 'year'; iso: string }
  | { kind: 'fragment'; text: string }

export function parseDateQuery(rawQuery: string): ParsedDateQuery | null {
  const trimmed = rawQuery.trim()
  if (!trimmed) return null

  const normalized = normalizeDateQuery(trimmed)
  if (normalized) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
      return { kind: 'full', iso: normalized }
    }
    if (/^\d{4}-\d{2}$/.test(normalized)) {
      return { kind: 'yearMonth', iso: normalized }
    }
    if (/^\d{4}$/.test(normalized)) {
      return { kind: 'year', iso: normalized }
    }
  }

  return { kind: 'fragment', text: trimmed.toLowerCase() }
}

function looksLikeDateQuery(query: string): boolean {
  const parsed = parseDateQuery(query)
  return parsed !== null && parsed.kind !== 'fragment'
}

/**
 * Match one stored ISO date (YYYY-MM-DD) against a search string.
 * Full dates require exact equality — no digit-substring or cross-year bleed.
 */
export function matchDateValue(storedIso: string, rawQuery: string): boolean {
  const actual = storedIso.trim().toLowerCase()
  if (!actual) return false

  const parsed = parseDateQuery(rawQuery)
  if (!parsed) return true

  switch (parsed.kind) {
    case 'full':
      return actual === parsed.iso.toLowerCase()
    case 'yearMonth':
      return actual.startsWith(`${parsed.iso.toLowerCase()}-`)
    case 'year':
      return actual.startsWith(`${parsed.iso.toLowerCase()}-`)
    case 'fragment':
      return actual.includes(parsed.text)
  }
}

function matchEnumValue(actual: string, query: string, allowed: readonly string[]): boolean {
  const a = actual.toLowerCase()
  const q = query.toLowerCase()
  if (allowed.some((v) => v.toLowerCase() === q)) {
    return a === q
  }
  return allowed.some((v) => {
    const vl = v.toLowerCase()
    return vl.startsWith(q) && a === vl
  })
}

function shouldUseExactIdMatch(query: string): boolean {
  if (!/^\d+$/.test(query)) return false
  if (looksLikeDateQuery(query)) return false
  return true
}

function matchField(key: string, value: unknown, query: string, rule: SearchFieldRule): boolean {
  if (value == null) return false

  switch (rule.kind) {
    case 'id':
      if (shouldUseExactIdMatch(query)) {
        return Number(value) === Number(query)
      }
      return String(value).toLowerCase().includes(query)
    case 'date':
      return matchDateValue(String(value), query)
    case 'enum':
      return matchEnumValue(String(value), query, rule.values)
    case 'text':
    default:
      if (key.toLowerCase() === 'status') {
        const s = String(value).toLowerCase()
        return s === query || s.startsWith(query)
      }
      return String(value).toLowerCase().includes(query)
  }
}

export function rowMatchesSearch(
  row: Record<string, unknown>,
  rawQuery: string,
  fields: RowSearchConfig,
): boolean {
  const query = rawQuery.trim().toLowerCase()
  if (!query) return true

  for (const [key, rule] of Object.entries(fields)) {
    if (rule.kind !== 'enum') continue
    if (rule.values.some((v) => v.toLowerCase() === query)) {
      const val = row[key]
      return val != null && String(val).toLowerCase() === query
    }
  }

  return Object.entries(fields).some(([key, rule]) => matchField(key, row[key], query, rule))
}

export function matchesSearchQuery(row: Record<string, unknown>, rawQuery: string): boolean {
  const query = rawQuery.trim().toLowerCase()
  if (!query) return true

  return Object.entries(row).some(([key, value]) => {
    if (value == null) return false
    const lowerKey = key.toLowerCase()

    if ((lowerKey === 'id' || lowerKey.endsWith('id')) && !isDateFieldKey(key)) {
      if (shouldUseExactIdMatch(query)) {
        return Number(value) === Number(query)
      }
    }

    if (lowerKey === 'status') {
      const s = String(value).toLowerCase()
      return s === query || s.startsWith(query)
    }

    if (isDateFieldKey(key)) {
      return matchDateValue(String(value), query)
    }

    return String(value).toLowerCase().includes(query)
  })
}
