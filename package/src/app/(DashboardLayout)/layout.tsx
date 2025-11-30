'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Header from './layout/header/Header'
import Sidebar from './layout/sidebar/Sidebar'
import { useAuth } from '../context/AuthContext'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Evitar bucle: las páginas de /auth no se protegen
    const isAuthRoute = pathname?.startsWith('/auth')

    if (!loading && !user && !isAuthRoute) {
      router.replace('/auth/login')
    }
  }, [user, loading, pathname, router])

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="text-sm text-gray-500">Cargando sesión…</p>
      </div>
    )
  }

  // Si no hay usuario y no estamos en /auth, no mostramos nada (useEffect redirige)
  if (!user && !pathname?.startsWith('/auth')) {
    return null
  }

  return (
    <div className="flex w-full min-h-screen bg-lightgray dark:bg-dark">
      <div className="page-wrapper flex w-full">
        {/* Sidebar solo si hay usuario */}
        {user && (
          <div className="xl:block hidden">
            <Sidebar />
          </div>
        )}

        <div className="body-wrapper w-full">
          {/* Header */}
          {user && <Header />}
          {/* Contenido */}
          <div className={`container mx-auto px-6 py-30`}>{children}</div>
        </div>
      </div>
    </div>
  )
}
