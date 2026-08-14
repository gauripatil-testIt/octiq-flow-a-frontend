/**
 * Employee API — calls /api/v1/employees by default.
 * Set VITE_USE_MOCK=true in .env to switch to the in-memory stub (data resets on refresh).
 */

import { matchesSearchQuery } from '../../shared/utils/matchRowSearch'
import { request, isAbortError, toApiBody } from '../../shared/utils/apiClient'
import { _mockSeeds, _mockInitialSeq } from './employeeMockData'
import { z } from 'zod'

export { isAbortError }

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Employee {
  id?: string
  name: string
  email: string
  department: string
  role: string
  salary: number
  status: string
  joiningDate?: string
  createdAt?: string
  updatedAt?: string
}

export interface EmployeeRequest {
  name: string
  email: string
  department: string
  role: string
  salary: number
  status: string
  joiningDate?: string
}

export interface EmployeeListParams {
  page?: number
  size?: number
  sort?: string
  search?: string
}

interface RequestOptions {
  signal?: AbortSignal
}

// ── Runtime schemas ───────────────────────────────────────────────────────────

const employeeSchema: z.ZodType<Employee> = z.object({
  id: z.string().nullish(),
  name: z.string(),
  email: z.string(),
  department: z.string(),
  role: z.string(),
  salary: z.coerce.number(),
  status: z.string(),
  joiningDate: z.string().nullish(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
})

const employeeListSchema = z.array(employeeSchema)
const employeePageSchema = z
  .object({
    content: employeeListSchema,
    totalElements: z.number().optional(),
  })
  .passthrough()

function parseEmployee(value: unknown): Employee {
  return employeeSchema.parse(value)
}

function parseEmployeeList(value: unknown): Employee[] {
  const direct = employeeListSchema.safeParse(value)
  if (direct.success) return direct.data
  const page = employeePageSchema.safeParse(value)
  if (page.success) return page.data.content
  if (
    value &&
    typeof value === 'object' &&
    Array.isArray((value as { content?: unknown }).content)
  ) {
    return (value as { content: unknown[] }).content.map((item) => parseEmployee(item))
  }
  return employeeListSchema.parse(value)
}

// ── Config ────────────────────────────────────────────────────────────────────

const BASE = '/api/v1/employees'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// ── In-memory stub (USE_MOCK=true) ────────────────────────────────────────────

let _store: Employee[] = [..._mockSeeds]
let _seq = _mockInitialSeq

const _delay = (ms = 80) => new Promise<void>((r) => setTimeout(r, ms))

// ── API functions ─────────────────────────────────────────────────────────────

export async function getAllEmployees(
  params?: EmployeeListParams,
  options: RequestOptions = {},
): Promise<Employee[]> {
  if (USE_MOCK) {
    await _delay()
    let data = [..._store]
    if (params?.search) data = data.filter((r) => matchesSearchQuery(r, params.search))
    return data
  }

  const qs = new URLSearchParams()
  if (params?.page !== undefined) qs.set('page', String(params.page))
  if (params?.size !== undefined) qs.set('size', String(params.size))
  if (typeof params?.sort === 'string' && params.sort) {
    const [sortBy, sortOrder] = params.sort.includes(',')
      ? params.sort.split(',', 2)
      : [params.sort, 'asc']
    if (sortBy) qs.set('sortBy', sortBy)
    qs.set('sortOrder', sortOrder === 'desc' ? 'desc' : 'asc')
  }
  if (typeof params?.search === 'string' && params.search) qs.set('search', params.search)
  const query = qs.toString()
  return request<Employee[]>(
    `${BASE}${query ? `?${query}` : ''}`,
    { signal: options.signal },
    parseEmployeeList,
  )
}

export async function getEmployeeById(
  id: string | number,
  options: RequestOptions = {},
): Promise<Employee> {
  if (USE_MOCK) {
    await _delay()
    const item = _store.find((r) => String(r.id) === String(id))
    if (!item) throw new Error('Employee not found')
    return { ...item }
  }

  return request<Employee>(`${BASE}/${id}`, { signal: options.signal }, parseEmployee)
}

export async function createEmployee(
  data: EmployeeRequest,
  options: RequestOptions = {},
): Promise<Employee> {
  if (USE_MOCK) {
    await _delay()
    const now = new Date().toISOString()
    const item = parseEmployee({ ...data, id: String(_seq++), createdAt: now, updatedAt: now })
    _store = [..._store, item]
    return { ...item }
  }

  return request<Employee>(
    BASE,
    {
      method: 'POST',
      body: JSON.stringify(toApiBody(data as Record<string, unknown>)),
      signal: options.signal,
    },
    parseEmployee,
  )
}

export async function updateEmployee(
  id: string | number,
  data: EmployeeRequest,
  options: RequestOptions = {},
): Promise<Employee> {
  if (USE_MOCK) {
    await _delay()
    const idx = _store.findIndex((r) => String(r.id) === String(id))
    if (idx === -1) throw new Error('Employee not found')
    const updated = parseEmployee({ ..._store[idx], ...data, updatedAt: new Date().toISOString() })
    _store = _store.map((r, i) => (i === idx ? updated : r))
    return { ...updated }
  }

  return request<Employee>(
    `${BASE}/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(toApiBody(data as Record<string, unknown>)),
      signal: options.signal,
    },
    parseEmployee,
  )
}

export async function deleteEmployee(
  id: string | number,
  options: RequestOptions = {},
): Promise<void> {
  if (USE_MOCK) {
    await _delay()
    const exists = _store.some((r) => String(r.id) === String(id))
    if (!exists) throw new Error('Employee not found')
    _store = _store.filter((r) => String(r.id) !== String(id))
    return
  }

  return request<void>(
    `${BASE}/${id}`,
    { method: 'DELETE', signal: options.signal },
    () => undefined,
  )
}

export async function getEmployeeOptions(
  options: RequestOptions = {},
): Promise<Record<string, string[]>> {
  if (USE_MOCK) {
    await _delay()
    return {}
  }

  return request<Record<string, string[]>>(`${BASE}/options`, { signal: options.signal }, (value) =>
    z.record(z.array(z.string())).parse(value),
  )
}
