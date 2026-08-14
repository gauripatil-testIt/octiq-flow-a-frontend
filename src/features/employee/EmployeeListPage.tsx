import { type Employee } from './employeeApi'
import { useEmployeeList } from './useEmployeeList'
import { CrudList, type CrudColumn } from '../../shared/components/CrudList'

export default function EmployeeListPage() {
  const {
    items,
    loading,
    error,
    load,
    deleteId,
    setDeleteId,
    deleting,
    handleDelete,
    searchInput,
    setSearchInput,
    qParam,
    pageParam,
    sortField,
    sortDir,
    handleSortClick,
    handlePrev,
    handleNext,
    hasNextPage,
  } = useEmployeeList()

  const COLUMNS: CrudColumn<Employee>[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'salary', label: 'Salary', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'joiningDate', label: 'Joining Date', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true },
    { key: 'updatedAt', label: 'Updated', sortable: true },
  ]

  return (
    <CrudList<Employee>
      entityName="Employee"
      entityNamePlural="Employees"
      resourcePath="employees"
      primaryKey="id"
      items={items}
      loading={loading}
      error={error}
      onRetry={load}
      columns={COLUMNS}
      deleteId={deleteId}
      onDeleteRequest={setDeleteId}
      onDeleteConfirm={handleDelete}
      onDeleteCancel={() => setDeleteId(null)}
      deleting={deleting}
      pageParam={pageParam}
      hasNextPage={hasNextPage}
      onPrev={handlePrev}
      onNext={handleNext}
      sortField={sortField}
      sortDir={sortDir}
      onSortClick={handleSortClick}
      qParam={qParam}
      searchToolbar={
        <div>
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search employees…"
              className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-4 text-sm text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Search employees"
            />
          </div>
        </div>
      }
    />
  )
}
