/**
 * Integration tests for Employee — full CRUD flow within one render tree.
 * These tests render ListPage + FormPage + DetailPage together in a real MemoryRouter
 * and verify navigation and data-flow across pages (no page-level mocking).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import EmployeeListPage from './EmployeeListPage'
import EmployeeFormPage from './EmployeeFormPage'
import EmployeeDetailPage from './EmployeeDetailPage'
import * as api from './employeeApi'

vi.mock('./employeeApi')

const seeds: api.Employee[] = [
  {
    createdAt: '1',
    department: 'Sample Department 1',
    email: 'user1@example.com',
    id: '1',
    joiningDate: 'Sample Joining Date 1',
    name: 'Sample Name 1',
    role: 'Sample Role 1',
    salary: 10,
    status: 'ACTIVE',
    updatedAt: '1',
  },
  {
    createdAt: '2',
    department: 'Sample Department 2',
    email: 'user2@example.com',
    id: '2',
    joiningDate: 'Sample Joining Date 2',
    name: 'Sample Name 2',
    role: 'Sample Role 2',
    salary: 20,
    status: 'INACTIVE',
    updatedAt: '2',
  },
  {
    createdAt: '3',
    department: 'Sample Department 3',
    email: 'user3@example.com',
    id: '3',
    joiningDate: 'Sample Joining Date 3',
    name: 'Sample Name 3',
    role: 'Sample Role 3',
    salary: 30,
    status: 'ON_LEAVE',
    updatedAt: '3',
  },
  {
    createdAt: '4',
    department: 'Sample Department 4',
    email: 'user4@example.com',
    id: '4',
    joiningDate: 'Sample Joining Date 4',
    name: 'Sample Name 4',
    role: 'Sample Role 4',
    salary: 40,
    status: 'TERMINATED',
    updatedAt: '4',
  },
  {
    createdAt: '5',
    department: 'Sample Department 5',
    email: 'user5@example.com',
    id: '5',
    joiningDate: 'Sample Joining Date 5',
    name: 'Sample Name 5',
    role: 'Sample Role 5',
    salary: 50,
    status: 'ACTIVE',
    updatedAt: '5',
  },
] as api.Employee[]

function renderApp(initialPath = '/employees') {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/employees" element={<EmployeeListPage />} />
          <Route path="/employees/create" element={<EmployeeFormPage />} />
          <Route path="/employees/:id" element={<EmployeeDetailPage />} />
          <Route path="/employees/:id/edit" element={<EmployeeFormPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(api.getAllEmployees).mockResolvedValue(seeds)
  vi.mocked(api.getEmployeeById).mockResolvedValue(seeds[0])
  vi.mocked(api.createEmployee).mockResolvedValue(seeds[0])
  vi.mocked(api.updateEmployee).mockResolvedValue(seeds[0])
  vi.mocked(api.deleteEmployee).mockResolvedValue(undefined)
})

describe('Employee integration', () => {
  it('list page loads and shows records', async () => {
    renderApp()
    expect(await screen.findByRole('link', { name: /new employee/i })).toBeInTheDocument()
    await waitFor(() => {
      expect(vi.mocked(api.getAllEmployees)).toHaveBeenCalled()
    })
  })

  it('list page shows empty state when API returns []', async () => {
    vi.mocked(api.getAllEmployees).mockResolvedValue([])
    renderApp()
    expect(await screen.findByText(/no employees yet/i)).toBeInTheDocument()
  })

  it('list page shows error state when API rejects', async () => {
    vi.mocked(api.getAllEmployees).mockRejectedValue(new Error('Network error'))
    renderApp()
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('create form renders at /employees/create', async () => {
    renderApp('/employees/create')
    expect(await screen.findByRole('link', { name: /back to employees/i })).toBeInTheDocument()
  })

  it('clicking new employee link navigates to create form', async () => {
    const user = userEvent.setup()
    renderApp()
    const newLink = await screen.findByRole('link', { name: /new employee/i })
    await user.click(newLink)
    expect(await screen.findByRole('link', { name: /back to employees/i })).toBeInTheDocument()
  })

  it('detail page renders for a known id', async () => {
    renderApp('/employees/1')
    await waitFor(() => {
      expect(vi.mocked(api.getEmployeeById)).toHaveBeenCalledWith('1', expect.any(Object))
    })
  })

  it('detail page shows heading after data loads', async () => {
    renderApp('/employees/1')
    expect(await screen.findByRole('heading', { name: /employee details/i })).toBeInTheDocument()
  })

  it('edit page renders at /employees/1/edit', async () => {
    renderApp('/employees/1/edit')
    expect(await screen.findByRole('link', { name: /back to employees/i })).toBeInTheDocument()
  })
  it('delete flow — confirm dialog calls delete API', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByRole('link', { name: /new employee/i })
    const deleteButtons = await screen.findAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])
    const dialog = await screen.findByRole('dialog')
    const confirmButton = within(dialog).getByRole('button', { name: /^delete$/i })
    await user.click(confirmButton)
    await waitFor(() => {
      expect(vi.mocked(api.deleteEmployee)).toHaveBeenCalled()
    })
  })

  it('delete flow — list reloads after successful delete', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByRole('link', { name: /new employee/i })
    const deleteButtons = await screen.findAllByRole('button', { name: /delete/i })
    vi.mocked(api.getAllEmployees).mockClear()
    await user.click(deleteButtons[0])
    const dialog = await screen.findByRole('dialog')
    const confirmButton = within(dialog).getByRole('button', { name: /^delete$/i })
    await user.click(confirmButton)
    await waitFor(() => {
      expect(vi.mocked(api.deleteEmployee)).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(vi.mocked(api.getAllEmployees)).toHaveBeenCalled()
    })
  })

  it('delete flow — cancelling dialog does not call delete API', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByRole('link', { name: /new employee/i })
    const deleteButtons = await screen.findAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])
    const dialog = await screen.findByRole('dialog')
    const cancelButton = within(dialog).getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)
    expect(vi.mocked(api.deleteEmployee)).not.toHaveBeenCalled()
  })
})
