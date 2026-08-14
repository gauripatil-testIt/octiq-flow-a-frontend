/** Manages list state for Employee: pagination, sorting, server-side search, and delete. Uses React Query for data fetching and cache invalidation. */
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { type Employee, getAllEmployees, deleteEmployee } from './employeeApi'

const PAGE_SIZE = 20
const QUERY_KEY = ['employees'] as const

export function useEmployeeList() {
  const [searchParams, setSearchParams] = useSearchParams()

  const qParam = searchParams.get('q') ?? ''
  const pageParam = Math.max(1, Number(searchParams.get('page') ?? '1'))
  const sortParam = searchParams.get('sort') ?? ''

  const [searchInput, setSearchInput] = useState(qParam)
  const debouncedSearch = useDebouncedValue(searchInput, 300)
  const [deleteId, setDeleteId] = useState<string | number | null>(null)

  // Sync debounced search to URL; reset to page 1 on new query.
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (debouncedSearch) {
          next.set('q', debouncedSearch)
          next.set('page', '1')
        } else {
          next.delete('q')
          next.set('page', '1')
        }
        return next
      },
      { replace: true },
    )
  }, [debouncedSearch, setSearchParams])

  const queryClient = useQueryClient()
  const params = {
    page: pageParam - 1,
    size: PAGE_SIZE,
    sort: sortParam || undefined,
    search: qParam || undefined,
  }

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: ({ signal }) =>
      getAllEmployees(params, signal).then((d) =>
        Array.isArray(d) ? d : (d as { content: Employee[] }).content,
      ),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  })

  const items = data ?? []

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => deleteEmployee(id),
    onSuccess: () => {
      setDeleteId(null)
      toast.success('Employee deleted')
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : 'Delete failed. Please try again.')
    },
  })

  const [sortField, sortDir] = sortParam.includes(',')
    ? (sortParam.split(',') as [string, string])
    : [sortParam, 'asc']

  const handleSortClick = useCallback(
    (field: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          const cur = prev.get('sort') ?? ''
          const [curField, curDir] = cur.includes(',') ? cur.split(',') : [cur, 'asc']
          next.set('sort', `${field},${curField === field && curDir === 'asc' ? 'desc' : 'asc'}`)
          next.set('page', '1')
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const handlePrev = () =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', String(Math.max(1, pageParam - 1)))
      return next
    })

  const handleNext = () =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', String(pageParam + 1))
      return next
    })

  return {
    items,
    loading: isLoading,
    error: error ? String(error) : null,
    load: refetch,
    deleteId,
    setDeleteId,
    deleting: deleteMutation.isPending,
    handleDelete: () => {
      if (deleteId !== null) deleteMutation.mutate(deleteId)
    },
    searchInput,
    setSearchInput,
    qParam,
    pageParam,
    sortField,
    sortDir,
    handleSortClick,
    handlePrev,
    handleNext,
    hasNextPage: items.length >= PAGE_SIZE,
  }
}
