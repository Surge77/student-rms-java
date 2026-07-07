import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider } from './store/AuthContext'
import { useAuth } from './store/AuthContext'
import { Layout } from './components/layout/Layout'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { StudentsPage } from './pages/StudentsPage'
import { SubjectsPage } from './pages/SubjectsPage'
import { MarksPage } from './pages/MarksPage'
import { ResultsPage } from './pages/ResultsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
})

function RequireAuth() {
  const { auth } = useAuth()
  return auth ? <Layout /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route path="/marks" element={<MarksPage />} />
              <Route path="/results" element={<ResultsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          theme="light"
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(44 47% 96%)',
              border: '1px solid hsl(38 20% 71%)',
              color: 'hsl(30 16% 12%)',
              fontFamily: 'Newsreader, Georgia, serif',
              borderRadius: '2px',
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  )
}
