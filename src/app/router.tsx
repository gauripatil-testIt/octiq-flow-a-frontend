import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import PageLoader from '../shared/components/PageLoader'
import Layout from '../components/Layout'
import NotFound from '../components/NotFound'
const EmployeeListPage = lazy(() => import('../features/employee/EmployeeListPage'))
const EmployeeDetailPage = lazy(() => import('../features/employee/EmployeeDetailPage'))
const EmployeeFormPage = lazy(() => import('../features/employee/EmployeeFormPage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/employees" replace /> },
      {
        path: 'employees',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <EmployeeListPage />
              </Suspense>
            ),
          },
          {
            path: 'create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EmployeeFormPage />
              </Suspense>
            ),
          },
          {
            path: ':id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EmployeeDetailPage />
              </Suspense>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EmployeeFormPage />
              </Suspense>
            ),
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
