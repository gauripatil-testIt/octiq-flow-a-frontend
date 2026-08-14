import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import EmployeeFormPage from './EmployeeFormPage'
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

function renderCreate() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/employees/create']}>
        <Routes>
          <Route path="/employees/create" element={<EmployeeFormPage />} />
          <Route path="/employees" element={<div>List page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

function renderEdit() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/employees/1/edit']}>
        <Routes>
          <Route path="/employees/:id/edit" element={<EmployeeFormPage />} />
          <Route path="/employees" element={<div>List page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  vi.mocked(api.createEmployee).mockResolvedValue(mockEmployee)
  vi.mocked(api.updateEmployee).mockResolvedValue(mockEmployee)
  vi.mocked(api.getEmployeeById).mockResolvedValue(mockEmployee)
})

describe('EmployeeFormPage — create', () => {
  it('renders the back link to list page', async () => {
    renderCreate()
    const backLink = await screen.findByRole('link', { name: /back to employees/i })
    expect(backLink).toHaveAttribute('href', '/employees')
  })

  it('submit button is present', async () => {
    renderCreate()
    await screen.findByRole('link', { name: /back to employees/i })
    expect(screen.getByRole('button', { name: /save|create/i })).toBeInTheDocument()
  })

  it('has a back link to the list page', async () => {
    renderCreate()
    const backLink = await screen.findByRole('link', { name: /back to employees/i })
    expect(backLink).toHaveAttribute('href', '/employees')
  })

  it('submit button is disabled when form is empty', async () => {
    renderCreate()
    await screen.findByRole('link', { name: /back to employees/i })
    expect(screen.getByRole('button', { name: /save|create/i })).toBeDisabled()
  })
})

describe('EmployeeFormPage — edit', () => {
  it('renders the back link to list page on edit', async () => {
    renderEdit()
    const backLink = await screen.findByRole('link', { name: /back to employees/i })
    expect(backLink).toHaveAttribute('href', '/employees')
  })

  it('fetches existing record data on mount', async () => {
    renderEdit()
    await waitFor(() => {
      expect(vi.mocked(api.getEmployeeById)).toHaveBeenCalledWith('1', expect.any(Object))
    })
  })

  it('shows server error when update API fails', async () => {
    vi.mocked(api.updateEmployee).mockRejectedValue(new Error('Server error'))
    const user = userEvent.setup()
    renderEdit()
    // wait for form to be populated with fetched data before submitting
    await waitFor(() => {
      expect(vi.mocked(api.getEmployeeById)).toHaveBeenCalled()
    })
    await user.click(screen.getByRole('button', { name: /save changes/i }))
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })
})
