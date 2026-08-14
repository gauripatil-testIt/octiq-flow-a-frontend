import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import EmployeeDetailPage from './EmployeeDetailPage'
import * as api from './employeeApi'

vi.mock('./employeeApi')

const mockEmployee = (
  [
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
)[0]

function renderDetail(id = '1') {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[`/employees/${id}`]}>
        <Routes>
          <Route path="/employees/:id" element={<EmployeeDetailPage />} />
          <Route path="/employees/:id/edit" element={<div>Edit page</div>} />
          <Route path="/employees" element={<div>List page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(api.getEmployeeById).mockResolvedValue(mockEmployee)
})

describe('EmployeeDetailPage', () => {
  it('fetches the entity by id on mount', async () => {
    renderDetail('1')
    await waitFor(() => {
      expect(vi.mocked(api.getEmployeeById)).toHaveBeenCalledWith('1', expect.any(Object))
    })
  })

  it('renders the page heading after data loads', async () => {
    renderDetail()
    expect(await screen.findByRole('heading', { name: /employee details/i })).toBeInTheDocument()
  })

  it('shows error state with retry option when API fails', async () => {
    vi.mocked(api.getEmployeeById).mockRejectedValue(new Error('Network error'))
    renderDetail()
    expect(await screen.findByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('retrying after error calls API again', async () => {
    vi.mocked(api.getEmployeeById)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValue(mockEmployee)
    const user = userEvent.setup()
    renderDetail()
    const retryButton = await screen.findByRole('button', { name: /try again/i })
    await user.click(retryButton)
    await waitFor(() => {
      expect(vi.mocked(api.getEmployeeById)).toHaveBeenCalledTimes(2)
    })
  })

  it('has an edit button that navigates to the edit page', async () => {
    renderDetail('1')
    await screen.findByRole('heading', { name: /employee details/i })
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
  })

  it('has a back button', async () => {
    renderDetail()
    await screen.findByRole('heading', { name: /employee details/i })
    expect(screen.getByRole('button', { name: /back|go back/i })).toBeInTheDocument()
  })
})
