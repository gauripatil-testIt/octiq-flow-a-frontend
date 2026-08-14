import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import EmployeeListPage from './EmployeeListPage'
import * as api from './employeeApi'

vi.mock('./employeeApi')

const mockEmployees: api.Employee[] = [
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

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/employees']}>
        <EmployeeListPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(api.getAllEmployees).mockResolvedValue(mockEmployees)
})

describe('EmployeeListPage', () => {
  it('renders the create button', async () => {
    renderPage()
    expect(await screen.findByRole('link', { name: /new employee/i })).toBeInTheDocument()
  })

  it('fetches and loads records', async () => {
    renderPage()
    await screen.findByRole('link', { name: /new employee/i })
    await waitFor(() => {
      expect(vi.mocked(api.getAllEmployees)).toHaveBeenCalled()
    })
  })

  it('shows empty state when no records', async () => {
    vi.mocked(api.getAllEmployees).mockResolvedValue([])
    renderPage()
    expect(await screen.findByText(/no employees yet/i)).toBeInTheDocument()
  })

  it('shows error state when API fails', async () => {
    vi.mocked(api.getAllEmployees).mockRejectedValue(new Error('Network error'))
    renderPage()
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('has a link to create a new employee', async () => {
    renderPage()
    const link = await screen.findByRole('link', { name: /new employee/i })
    expect(link).toHaveAttribute('href', '/employees/create')
  })
  it('renders a row for each fetched record', async () => {
    renderPage()
    await screen.findByRole('link', { name: /new employee/i })
    await waitFor(() => {
      const rows = screen.getAllByRole('row')
      expect(rows.length).toBeGreaterThan(1)
    })
  })

  it('shows delete buttons for each record', async () => {
    renderPage()
    await screen.findByRole('link', { name: /new employee/i })
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /delete/i }).length).toBeGreaterThan(0)
    })
  })

  it('retry after error calls API again', async () => {
    vi.mocked(api.getAllEmployees)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValue(mockEmployees)
    const user = userEvent.setup()
    renderPage()
    await screen.findByRole('alert')
    const retryButton = screen.getByRole('button', { name: /try again/i })
    vi.mocked(api.getAllEmployees).mockClear()
    await user.click(retryButton)
    await waitFor(() => {
      expect(vi.mocked(api.getAllEmployees)).toHaveBeenCalled()
    })
  })
})
