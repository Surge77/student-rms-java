import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, CircleNotch as Loader2, Eye, EyeSlash as EyeOff } from '@phosphor-icons/react'
import { login } from '../api/auth'
import { useAuth } from '../store/AuthContext'
import { loginSchema } from '../lib/schemas'
import { AuthBackground } from '../components/layout/AuthBackground'
import { Seal } from '../components/shared/Seal'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Alert } from '../components/ui/alert'

export function LoginPage() {
  const navigate = useNavigate()
  const { login: setAuth } = useAuth()
  const [apiError, setApiError] = useState('')
  const [showPw, setShowPw] = useState(false)

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
      <div className="mx-auto w-full max-w-[420px]">
        {/* Enrollment certificate */}
        <div className="sheet engraved ink-rise rounded-sm p-9 sm:p-10">
          {/* Seal + institutional kicker */}
          <div className="mb-7 flex flex-col items-center text-center">
            <Seal className="h-14 w-14 text-primary" />
            <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.34em] text-muted-foreground">
              Office of the Registrar
            </p>
            <h1 className="mt-2 font-display text-4xl leading-none text-foreground">
              Student Result Ledger
            </h1>
            <p className="mt-3 max-w-[15rem] text-[13px] italic leading-snug text-muted-foreground">
              Present your credentials to consult the record.
            </p>
          </div>

          <div className="double-rule mb-7" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Alert message={apiError} />

            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="your.username"
                autoComplete="username"
                {...register('username')}
              />
              {errors.username && (
                <p className="text-xs text-destructive">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
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
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                  tabIndex={-1}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="group h-11 w-full text-[15px]" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying…
                </>
              ) : (
                <>
                  Enter the record room
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Not yet enrolled?{' '}
          <Link to="/register" className="font-medium text-primary underline underline-offset-4">
            Request an account
          </Link>
        </p>
      </div>
    </AuthBackground>
  )
}
