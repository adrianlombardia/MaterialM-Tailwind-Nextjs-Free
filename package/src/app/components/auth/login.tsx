'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FullLogo from '@/app/(DashboardLayout)/layout/shared/logo/FullLogo'
import CardBox from '../shared/CardBox'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/app/context/AuthContext'

export const Login = () => {
  const { login, user, loading } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Si ya está logueado, mandarlo al dashboard
  useEffect(() => {
    if (user) {
      router.replace('/')
    }
  }, [user, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      router.replace('/')
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="h-screen w-full flex justify-center items-center bg-lightprimary">
      <div className="md:min-w-[450px] min-w-max">
        <CardBox>
          <div className="flex justify-center mb-4">
            <FullLogo />
          </div>
          <p className="text-sm text-charcoal text-center mb-6">
            Accede al panel de Horta OUTEIRO
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" className="font-medium">
                  Email
                </Label>
              </div>
              <Input
                id="email"
                type="email"
                placeholder="admin@admin.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" className="font-medium">
                  Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <div className="flex flex-wrap gap-6 items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(v) => setRemember(Boolean(v))}
                />
                <Label
                  className="text-link font-normal text-sm"
                  htmlFor="remember"
                >
                  Recordar este dispositivo
                </Label>
              </div>
              {/* Podrás implementar esto más adelante */}
              <span className="text-sm font-medium text-link/60">
                {/* Forgot Password ? */}
              </span>
            </div>

            {error && (
              <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
            )}

            <Button
              className="w-full rounded-full mt-2"
              type="submit"
              disabled={submitting || loading}
            >
              {submitting || loading ? 'Entrando…' : 'Sign In'}
            </Button>
          </form>

          <div className="flex items center gap-2 justify-center mt-6 flex-wrap">
            <p className="text-base font-medium text-link dark:text-darklink">
              Nuevo en el panel?
            </p>
            <Link
              href="/auth/register"
              className="text-sm font-medium text-primary hover:text-primaryemphasis"
            >
              Crear una cuenta
            </Link>
          </div>
        </CardBox>
      </div>
    </div>
  )
}
