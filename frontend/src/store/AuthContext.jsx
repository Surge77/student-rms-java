import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

function getStoredAuth() {
  const token = localStorage.getItem('srms_token')
  const raw = localStorage.getItem('srms_user')
  if (token && raw) {
    try {
      return { token, user: JSON.parse(raw) }
    } catch {
      return null
    }
  }
  return null
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth)

  const login = useCallback((token, username, role) => {
    const user = { username, role }
    localStorage.setItem('srms_token', token)
    localStorage.setItem('srms_user', JSON.stringify(user))
    setAuth({ token, user })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('srms_token')
    localStorage.removeItem('srms_user')
    setAuth(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        logout,
        isAdmin: auth?.user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
