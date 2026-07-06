import { useQuery } from '@tanstack/react-query'
import { Users, BookOpen, ClipboardText as ClipboardList, ChartBar as BarChart3, ArrowRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { getStudents } from '../api/students'
import { getSubjects } from '../api/subjects'
import { useAuth } from '../store/AuthContext'
import { StatCard } from '../components/shared/StatCard'
import { Skeleton } from '../components/ui/skeleton'
import { Button } from '../components/ui/button'

function StatSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <Skeleton className="mb-2 h-3 w-24" />
      <Skeleton className="mt-2 h-8 w-16" />
    </div>
  )
}

const quickLinks = [
  { to: '/students', label: 'View Students', icon: Users, description: 'Browse enrolled students' },
  { to: '/subjects', label: 'View Subjects', icon: BookOpen, description: 'Browse all subjects' },
  { to: '/marks', label: 'Check Marks', icon: ClipboardList, description: 'View marks by student' },
  { to: '/results', label: 'View Results', icon: BarChart3, description: 'Academic result cards' },
]

export function DashboardPage() {
  const { auth, isAdmin } = useAuth()

  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['students', 0, 1],
    queryFn: () => getStudents(0, 1),
  })

  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects', 0, 1],
    queryFn: () => getSubjects(0, 1),
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Good morning, {auth?.user?.username}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s an overview of the system.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {studentsLoading ? (
          <StatSkeleton />
        ) : (
          <StatCard
            title="Total Students"
            value={students?.totalElements ?? '—'}
            icon={Users}
            description="Enrolled in the system"
          />
        )}
        {subjectsLoading ? (
          <StatSkeleton />
        ) : (
          <StatCard
            title="Total Subjects"
            value={subjects?.totalElements ?? '—'}
            icon={BookOpen}
            description="Active subjects"
          />
        )}
        <StatCard
          title="Your Role"
          value={auth?.user?.role}
          icon={isAdmin ? ClipboardList : BarChart3}
          description={isAdmin ? 'Full CRUD access' : 'Read-only access'}
        />
        <StatCard
          title="System"
          value="Online"
          icon={BarChart3}
          description="Backend connected"
        />
      </div>

      {/* Quick links */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Quick access
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map(({ to, label, icon: Icon, description }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-card"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>

      {isAdmin && (
        <div className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-5">
          <p className="text-sm font-medium text-primary">Admin access active</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            You can create, edit and delete students, subjects, and marks.
          </p>
        </div>
      )}
    </div>
  )
}
