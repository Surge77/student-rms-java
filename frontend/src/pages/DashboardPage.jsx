import { useQuery } from '@tanstack/react-query'
import { Users, BookOpen, ClipboardText as ClipboardList, ChartBar as BarChart3, ArrowRight, ShieldCheck } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { getStudents } from '../api/students'
import { getSubjects } from '../api/subjects'
import { useAuth } from '../store/AuthContext'
import { StatCard } from '../components/shared/StatCard'
import { Masthead } from '../components/shared/Masthead'
import { Skeleton } from '../components/ui/skeleton'

function StatSkeleton() {
  return (
    <div className="sheet rounded-sm p-5">
      <Skeleton className="mb-4 h-3 w-10" />
      <Skeleton className="h-9 w-16" />
      <Skeleton className="mt-5 h-3 w-24" />
    </div>
  )
}

const registers = [
  { to: '/students', label: 'Students', icon: Users, description: 'The enrolment register' },
  { to: '/subjects', label: 'Subjects', icon: BookOpen, description: 'The syllabus of record' },
  { to: '/marks', label: 'Marks', icon: ClipboardList, description: 'Marks entered per student' },
  { to: '/results', label: 'Results', icon: BarChart3, description: 'Examination result cards' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

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

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div>
      <Masthead
        index="00"
        title={`${getGreeting()}, ${auth?.user?.username}.`}
        subtitle="The state of the record, at a glance."
        meta={today}
      />

      {/* Ledger figures */}
      <div className="ink-rise d-1 mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {studentsLoading ? (
          <StatSkeleton />
        ) : (
          <StatCard
            index="01"
            title="Students Enrolled"
            value={students?.totalElements ?? '—'}
            icon={Users}
            description="On the register"
          />
        )}
        {subjectsLoading ? (
          <StatSkeleton />
        ) : (
          <StatCard
            index="02"
            title="Subjects of Record"
            value={subjects?.totalElements ?? '—'}
            icon={BookOpen}
            description="In the syllabus"
          />
        )}
        <StatCard
          index="03"
          title="Your Standing"
          value={isAdmin ? 'Registrar' : 'Reader'}
          icon={ShieldCheck}
          description={isAdmin ? 'Full authority' : 'Read-only'}
        />
        <StatCard
          index="04"
          title="The Ledger"
          value="Open"
          icon={BarChart3}
          description="Records available"
        />
      </div>

      {/* Registers */}
      <section className="ink-rise d-2">
        <h2 className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
          The Registers
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {registers.map(({ to, label, icon: Icon, description }, i) => (
            <Link
              key={to}
              to={to}
              className="sheet group flex items-center justify-between rounded-sm px-5 py-4 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-[11px] tabular-nums text-primary">
                  № {String(i + 1).padStart(2, '0')}
                </span>
                <Icon className="h-5 w-5 text-foreground/70" weight="duotone" />
                <div>
                  <p className="font-display text-lg leading-none text-foreground">{label}</p>
                  <p className="mt-1 text-[13px] italic text-muted-foreground">{description}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 flex-shrink-0 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>

      {isAdmin && (
        <div className="ink-rise d-3 margin-rule mt-8 rounded-sm border border-primary/30 bg-primary/[0.06] py-4 pl-14 pr-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
            Registrar's seal active
          </p>
          <p className="mt-1 text-[13px] italic text-muted-foreground">
            You may create, amend, and strike records for students, subjects, and marks.
          </p>
        </div>
      )}
    </div>
  )
}
