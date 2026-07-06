import { NavLink } from 'react-router-dom'
import {
  SquaresFour as LayoutDashboard,
  Users,
  BookOpen,
  ClipboardText as ClipboardList,
  ChartBar as BarChart3,
  GraduationCap,
  SignOut as LogOut,
} from '@phosphor-icons/react'
import { useAuth } from '../../store/AuthContext'
import { cn } from '../../lib/utils'
import { Separator } from '../ui/separator'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/students', icon: Users, label: 'Students' },
  { to: '/subjects', icon: BookOpen, label: 'Subjects' },
  { to: '/marks', icon: ClipboardList, label: 'Marks' },
  { to: '/results', icon: BarChart3, label: 'Results' },
]

export function Sidebar() {
  const { auth, logout } = useAuth()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-card">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15">
          <GraduationCap className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight text-foreground">SRMS</p>
          <p className="text-[10px] text-muted-foreground leading-none">Result Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Navigation
        </p>
        <ul className="space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-100',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'h-4 w-4 flex-shrink-0',
                        isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User section */}
      <div className="px-3 pb-4">
        <Separator className="mb-4" />
        <div className="mb-1 rounded-md px-3 py-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
              {auth?.user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {auth?.user?.username}
              </p>
              <span className="inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                {auth?.user?.role}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
