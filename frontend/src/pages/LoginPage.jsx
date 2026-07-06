import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GraduationCap, ArrowRight, CircleNotch as Loader2, Eye, EyeSlash as EyeOff, SunHorizon as Sunrise, Sun, Moon } from '@phosphor-icons/react'
import { login } from '../api/auth'
import { useAuth } from '../store/AuthContext'
import { loginSchema } from '../lib/schemas'
import { AuthBackground } from '../components/layout/AuthBackground'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Alert } from '../components/ui/alert'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Good morning', Icon: Sunrise }
  if (h < 17) return { text: 'Good afternoon', Icon: Sun }
  return { text: 'Good evening', Icon: Moon }
}

export function LoginPage() {
  const navigate = useNavigate()
  const { login: setAuth } = useAuth()
  const [apiError, setApiError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const { text: greeting, Icon: GreetIcon } = getGreeting()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data) {
    setApiError('')
    try {
      const res = await login(data)
      setAuth(res.token, res.username, res.role)
      navigate('/dashboard')
    } catch (err) {
      setApiError(err.response?.data?.message ?? 'Invalid credentials')
    }
  }

  return (
    <AuthBackground>
      <div className="mx-auto w-full max-w-[400px]">
        {/* Card with amber top-accent hairline */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-card/70 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.07)] ring-1 ring-white/[0.04]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

          <div className="p-8 sm:p-10">
            {/* Brand */}
            <div
              className="mb-8 flex items-center gap-2.5 animate-fade-up"
              style={{ animationDelay: '0ms' }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/20">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="leading-none">
                <p className="text-sm font-semibold text-foreground">SRMS</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Result Management</p>
              </div>
            </div>

            {/* Time-aware greeting */}
            <div className="mb-8 animate-fade-up" style={{ animationDelay: '80ms' }}>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                <GreetIcon className="h-3 w-3 text-primary" />
                {greeting}
              </div>
              <h1 className="text-3xl font-bold leading-tight text-foreground">
                Welcome back.
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Sign in to access your records.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="animate-fade-up" style={{ animationDelay: '160ms' }}>
                <Alert message={apiError} className="mb-4" />
              </div>

              <div className="space-y-1.5 animate-fade-up" style={{ animationDelay: '160ms' }}>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="your.username"
                  autoComplete="username"
                  {...register('username')}
                />
                {errors.username && (
                  <p className="text-xs text-red-400">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-1.5 animate-fade-up" style={{ animationDelay: '220ms' }}>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="pr-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                    tabIndex={-1}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400">{errors.password.message}</p>
                )}
              </div>

              <div className="animate-fade-up pt-1" style={{ animationDelay: '300ms' }}>
                <Button
                  type="submit"
                  className="group h-11 w-full text-[15px] hover:scale-[1.01]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <p
          className="mt-6 text-center text-sm text-muted-foreground animate-fade-up"
          style={{ animationDelay: '380ms' }}
        >
          New here?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </div>
    </AuthBackground>
  )
}
