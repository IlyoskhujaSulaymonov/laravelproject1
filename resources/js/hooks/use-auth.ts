"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
}

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem("authToken")
      const userData = localStorage.getItem("userData")

      if (token && userData) {
        setIsLoggedIn(true)
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = (token: string, userData: User) => {
    localStorage.setItem("authToken", token)
    localStorage.setItem("userData", JSON.stringify(userData))
    setIsLoggedIn(true)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    setIsLoggedIn(false)
    setUser(null)
  }

  return {
    isLoggedIn,
    user,
    loading,
    login,
    logout,
    checkAuthStatus,
  }
}
