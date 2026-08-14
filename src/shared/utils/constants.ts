// ── Pagination ────────────────────────────────────────────────────────────────
export const PAGE_SIZE = 20

// ── Local storage keys ────────────────────────────────────────────────────────
export const TOKEN_KEY = 'octiq-enterprise-flow-a-employee-management-ui_token'
export const USER_KEY = 'octiq-enterprise-flow-a-employee-management-ui_user'

// ── Route paths ───────────────────────────────────────────────────────────────
export const ROUTES = {
  Employee: {
    list: '/employees',
    create: '/employees/create',
    detail: (id: string | number) => `/employees/${id}`,
    edit: (id: string | number) => `/employees/${id}/edit`,
  },
} as const
