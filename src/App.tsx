import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { ThemeProvider } from './app/contexts/ThemeContext'
import { Toaster } from './components/Toaster'
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary'

export default function App() {
  return (
    <GlobalErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </GlobalErrorBoundary>
  )
}
