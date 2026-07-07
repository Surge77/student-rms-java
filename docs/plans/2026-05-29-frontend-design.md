# Frontend Design Plan — 2026-05-29

## Stack
- React 18 + Vite
- Tailwind CSS v3 (dark-only, CSS variables)
- shadcn/ui components (written manually, Radix UI primitives)
- React Router v6 (nested routes, Outlet)
- TanStack Query v5 (server state, cache invalidation)
- Axios (JWT interceptor, 401 redirect)
- React Hook Form + Zod (validation)
- Sonner (toast notifications)
- Lucide React (icons)

## Design Language
- Dark academic + modern SaaS mix
- Background: #0e1118, Card: #13181f, Border: #1e2a3a
- Primary accent: indigo (#6366f1)
- Grade badges: color-coded translucent pills
- Inter font, 0.5rem border radius
- Fixed sidebar (240px) + scrollable main content

## Routes
| Path | Component | Auth |
|------|-----------|------|
| /login | LoginPage | public |
| /register | RegisterPage | public |
| /dashboard | DashboardPage | protected |
| /students | StudentsPage | protected |
| /subjects | SubjectsPage | protected |
| /marks | MarksPage | protected |
| /results | ResultsPage | protected |

## Architecture
- `lib/axios.js` — base instance, JWT interceptor, 401→redirect
- `lib/schemas.js` — Zod schemas for all forms
- `store/AuthContext.jsx` — JWT in localStorage, role, useAuth hook
- `api/*.js` — one file per resource, thin wrappers over axios
- `components/ui/` — shadcn-style components (button, input, label, card, badge, dialog, table, select, separator, skeleton, alert)
- `components/layout/` — Sidebar, Layout (Outlet-based)
- `components/shared/` — ProtectedRoute, GradeBadge, EmptyState, StatCard, ConfirmDialog
- `pages/` — one file per route

## Key UX Decisions
- ADMIN sees full CRUD; USER sees read-only data
- Marks page: select student → see marks (no general marks list in API)
- Results page: select student → academic result card
- Pagination on Students + Subjects tables
- Sonner for success/error toasts (no custom toast system)
