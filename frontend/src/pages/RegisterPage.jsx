import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GraduationCap, UserPlus, CircleNotch as Loader2, Eye, EyeSlash as EyeOff, CheckCircle as CheckCircle2 } from '@phosphor-icons/react'
import { register as registerApi } from '../api/auth'
import { registerSchema } from '../lib/schemas'
import { AuthBackground } from '../components/layout/AuthBackground'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Alert } from '../components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'

export function RegisterPage() {
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'USER' },
  })

  async function onSubmit(data) {
    setApiError('')
    try {
      await registerApi(data)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1400)
    } catch (err) {
      setApiError(err.response?.data?.message ?? 'Registration failed')
    }
  }

  return (
    <AuthBackground>
      <div className="mx-auto w-full max-w-[400px]">
        <div className="relative overflow-hidden rounded-xl border border-border bg-card/70 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.07)] ring-1 ring-white/[0.04]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

          <div className="p-8 sm:p-10">
            <div className="mb-8 flex items-center gap-2.5 animate-fade-up">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/20">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="leading-none">
                <p className="text-sm font-semibold text-foreground">SRMS</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Result Management</p>
              </div>
            </div>

            <div className="mb-8 animate-fade-up" style={{ animationDelay: '80ms' }}>
              <h1 className="text-3xl font-bold leading-tight text-foreground">
                Create account.
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Set up access to the result system.
              </p>
            </div>

            {success ? (
              <div className="flex items-center gap-2.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 animate-fade-up">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                Account created — redirecting to sign in…
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
                  <Alert message={apiError} className="mb-4" />
                </div>

                <div className="space-y-1.5 animate-fade-up" style={{ animationDelay: '120ms' }}>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="choose.a.username"
                    autoComplete="username"
                    {...register('username')}
                  />
                  {errors.username && (
                    <p className="text-xs text-red-400">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-1.5 animate-fade-up" style={{ animationDelay: '180ms' }}>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPw ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="new-password"
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

                <div className="space-y-1.5 animate-fade-up" style={{ animationDelay: '240ms' }}>
                  <Label>Role</Label>
                  <Select defaultValue="USER" onValueChange={(val) => setValue('role', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">USER — read-only access</SelectItem>
                      <SelectItem value="ADMIN">ADMIN — full access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="animate-fade-up pt-1" style={{ animationDelay: '300ms' }}>
                  <Button
                    type="submit"
                    className="h-11 w-full text-[15px] hover:scale-[1.01]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <UserPlus className="mr-2 h-4 w-4" />
                    )}
                    {isSubmitting ? 'Creating account…' : 'Create account'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        <p
          className="mt-6 text-center text-sm text-muted-foreground animate-fade-up"
          style={{ animationDelay: '360ms' }}
        >
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </AuthBackground>
  )
}
