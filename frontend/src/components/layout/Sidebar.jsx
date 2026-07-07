import { NavLink } from 'react-router-dom'
import {
  SquaresFour as LayoutDashboard,
  Users,
  BookOpen,
  ClipboardText as ClipboardList,
  ChartBar as BarChart3,
  SignOut as LogOut,
} from '@phosphor-icons/react'
import { useAuth } from '../../store/AuthContext'
import { cn } from '../../lib/utils'
import { Seal } from '../shared/Seal'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Registry' },
  { to: '/students', icon: Users, label: 'Students' },
  { to: '/subjects', icon: BookOpen, label: 'Subjects' },
  { to: '/marks', icon: ClipboardList, label: 'Marks' },
  { to: '/results', icon: BarChart3, label: 'Results' },
]

export function Sidebar() {
  const { auth, logout } = useAuth()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-card/70 backdrop-blur-sm">
      {/* Masthead */}
      <div className="border-b-[3px] border-double border-foreground/40 px-5 py-5">
        <div className="flex items-center gap-3 text-foreground">
          <Seal className="h-9 w-9 text-primary" />
          <div className="leading-none">
            <p className="font-display text-xl tracking-tight">S · R · M · S</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Office of the Registrar
            </p>
          </div>
        </div>
      </div>

      {/* Index */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-2 font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-muted-foreground/70">
          Index
        </p>
        <ul className="space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }, i) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center gap-3 rounded-sm px-2.5 py-2 text-[15px] transition-colors',
                    isActive
                      ? 'text-primary'
                      : 'text-foreground/70 hover:bg-foreground/[0.05] hover:text-foreground'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-primary" />
                    )}
                    <span
                      className={cn(
                        'font-mono text-[10px] tabular-nums',
                        isActive ? 'text-primary' : 'text-muted-foreground/60'
                      )}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <Icon
                      className={cn('h-4 w-4 flex-shrink-0', isActive && 'text-primary')}
                      weight={isActive ? 'fill' : 'regular'}
                    />
                    <span
                      className={cn(
                        isActive && 'underline decoration-primary/50 decoration-1 underline-offset-4'
                      )}
                    >
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Signatory */}
      <div className="border-t border-border px-3 py-4">
        <div className="mb-2 flex items-center gap-2.5 px-1.5">
          <div className="engraved flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-card font-display text-base text-primary">
            {auth?.user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{auth?.user?.username}</p>
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {auth?.user?.role === 'ADMIN' ? 'Registrar' : 'Reader'} · {auth?.user?.role}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-sm px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
