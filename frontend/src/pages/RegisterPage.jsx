import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus, CircleNotch as Loader2, Eye, EyeSlash as EyeOff, CheckCircle as CheckCircle2 } from '@phosphor-icons/react'
import { register as registerApi } from '../api/auth'
import { registerSchema } from '../lib/schemas'
import { AuthBackground } from '../components/layout/AuthBackground'
import { Seal } from '../components/shared/Seal'
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
      <div className="mx-auto w-full max-w-[420px]">
        <div className="sheet engraved ink-rise rounded-sm p-9 sm:p-10">
          <div className="mb-7 flex flex-col items-center text-center">
            <Seal className="h-14 w-14 text-primary" />
            <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.34em] text-muted-foreground">
              Registration of Record
            </p>
            <h1 className="mt-2 font-display text-4xl leading-none text-foreground">
              Enrol an Account
            </h1>
            <p className="mt-3 max-w-[16rem] text-[13px] italic leading-snug text-muted-foreground">
              Register a credential to access the result ledger.
            </p>
          </div>

          <div className="double-rule mb-7" />

          {success ? (
            <div className="flex items-center gap-2.5 border-l-2 border-ink-green bg-ink-green/[0.08] px-4 py-3 text-sm text-ink-green">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" weight="fill" />
              Account entered into the register — redirecting to sign in…
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Alert message={apiError} />

              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="choose.a.username"
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
                    autoComplete="new-password"
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

              <div className="space-y-1.5">
                <Label>Register as</Label>
                <Select defaultValue="USER" onValueChange={(val) => setValue('role', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Reader — read-only access</SelectItem>
                    <SelectItem value="ADMIN">Registrar — full access</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="h-11 w-full text-[15px]" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? 'Entering into register…' : 'Enter into the register'}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already enrolled?{' '}
          <Link to="/login" className="font-medium text-primary underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </AuthBackground>
  )
}
