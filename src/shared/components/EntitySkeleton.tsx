import React from 'react'

export function SkeletonBox({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-border/40 rounded ${className}`} />
}

export function EntityListSkeleton() {
  return (
    <div className="w-full overflow-hidden">
      <table className="min-w-full divide-y divide-border">
        <thead>
          <tr>
            {['col-1', 'col-2', 'col-3', 'col-4'].map((k) => (
              <th key={k} className="px-6 py-3">
                <SkeletonBox className="h-4 w-24" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {['row-1', 'row-2', 'row-3', 'row-4', 'row-5', 'row-6', 'row-7', 'row-8'].map(
            (rowKey) => (
              <tr key={rowKey}>
                {['cell-1', 'cell-2', 'cell-3', 'cell-4'].map((cellKey) => (
                  <td key={cellKey} className="px-6 py-4">
                    <SkeletonBox className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ),
          )}
        </tbody>
      </table>
      <div className="flex items-center justify-between px-6 py-4">
        <SkeletonBox className="h-8 w-24" />
        <SkeletonBox className="h-8 w-32" />
        <SkeletonBox className="h-8 w-24" />
      </div>
    </div>
  )
}

export function EntityDetailSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <SkeletonBox className="h-8 w-64 mb-6" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {['field-1', 'field-2', 'field-3', 'field-4', 'field-5', 'field-6'].map((k) => (
          <div key={k} className="space-y-2">
            <SkeletonBox className="h-4 w-20" />
            <SkeletonBox className="h-5 w-full" />
          </div>
        ))}
      </div>
      <div className="pt-4">
        <SkeletonBox className="h-9 w-24" />
      </div>
    </div>
  )
}

export function EntityFormSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <SkeletonBox className="h-8 w-48 mb-6" />
      <div className="space-y-4">
        {['field-1', 'field-2', 'field-3', 'field-4'].map((k) => (
          <div key={k} className="space-y-2">
            <SkeletonBox className="h-4 w-24" />
            <SkeletonBox className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="pt-2">
        <SkeletonBox className="h-10 w-28" />
      </div>
    </div>
  )
}
