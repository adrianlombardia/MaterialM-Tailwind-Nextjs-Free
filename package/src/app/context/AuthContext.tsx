'use client'

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react'

type User = {
    id: number
    name: string
    email: string
    role: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    // Cargar estado desde localStorage al arrancar
    useEffect(() => {
        if (typeof window === 'undefined') return

        const storedToken = localStorage.getItem('authToken')
        const storedUser = localStorage.getItem('authUser')

        if (storedToken && storedUser) {
            setToken(storedToken)
            try {
                setUser(JSON.parse(storedUser))
            } catch {
                setUser(null)
            }
        }

        setLoading(false)
    }, [])


    const login = async (email: string, password: string) => {
        setLoading(true)
        try {
            const res = await fetch(
                // pon aquí tu URL de backend si es otra
                process.env.NEXT_PUBLIC_AUTH_URL ||
                'http://localhost:3001/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                }
            )

            const data = await res.json().catch(() => ({}))

            if (!res.ok) {
                throw new Error(data.message || 'Error al iniciar sesión')
            }

            // data = { token, user: { id, name, email, role } }
            setToken(data.token)
            setUser(data.user)

            if (typeof window !== 'undefined') {
                localStorage.setItem('authToken', data.token)
                localStorage.setItem('authUser', JSON.stringify(data.user))
            }
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken')
            localStorage.removeItem('authUser')
        }
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error('useAuth debe usarse dentro de <AuthProvider>')
    }
    return ctx
}
