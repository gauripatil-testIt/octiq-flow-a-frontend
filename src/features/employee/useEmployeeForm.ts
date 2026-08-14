/** Manages create/edit form submission for Employee using React Query mutations. Invalidates the list cache on success. */
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { type EmployeeRequest, createEmployee, updateEmployee } from './employeeApi'

export function useEmployeeForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const queryClient = useQueryClient()
  const [serverError, setServerError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (payload: EmployeeRequest) =>
      isEdit && id ? updateEmployee(id, payload) : createEmployee(payload),
    onSuccess: () => {
      toast.success(isEdit ? 'Employee updated' : 'Employee created')
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      navigate('/employees')
    },
    onError: (err) => {
      setServerError(err instanceof Error ? err.message : 'Save failed. Please try again.')
    },
  })

  async function submit(payload: EmployeeRequest, onSuccess?: () => void): Promise<void> {
    setServerError(null)
    try {
      await mutation.mutateAsync(payload)
      onSuccess?.()
    } catch {
      // error already handled by mutation onError → serverError state
    }
  }

  return { id, isEdit, serverError, setServerError, submit }
}
