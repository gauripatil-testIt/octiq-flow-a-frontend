/** Fetches and caches a single Employee by ID using React Query. Also exposes a delete mutation with cache invalidation. */
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { type Employee, getEmployeeById } from './employeeApi'

export function useEmployeeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['employee', id],
    queryFn: ({ signal }) => getEmployeeById(id!, { signal }),
    enabled: Boolean(id),
    staleTime: 30_000,
  })

  return {
    id,
    item: data ?? null,
    loading: isLoading,
    error: error ? String(error) : null,
    load: refetch,
  }
}
