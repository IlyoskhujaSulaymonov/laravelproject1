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

  const checkAuthStatus = async () => {
    try {
      setLoading(true)
      
      // First check localStorage for quick UI update
      const token = localStorage.getItem("authToken")
      const userData = localStorage.getItem("userData")
      
      if (token && userData) {
        setIsLoggedIn(true)
        setUser(JSON.parse(userData))
      }
      
      // Then verify with the backend (this is the most important check)
      try {
        const response = await fetch('/user/profile', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          credentials: 'include', // Include cookies for Laravel Sanctum
        })
        
        if (response.ok) {
          const backendResponse = await response.json()
          
          const backendUser = backendResponse.data || backendResponse
          const userObj = {
            id: backendUser.id?.toString() || '1',
            name: backendUser.name || 'User',
            email: backendUser.email || ''
          }
          
          // Update state with backend data
          setIsLoggedIn(true)
          setUser(userObj)
          
          // Update localStorage to keep in sync
          localStorage.setItem("authToken", "session-authenticated")
          localStorage.setItem("userData", JSON.stringify(userObj))
        } else {
          // User is not authenticated according to backend
          setIsLoggedIn(false)
          setUser(null)
          localStorage.removeItem("authToken")
          localStorage.removeItem("userData")
        }
      } catch (fetchError) {
        // If backend is unreachable, fallback to localStorage
        if (token && userData) {
          setIsLoggedIn(true)
          setUser(JSON.parse(userData))
        } else {
          setIsLoggedIn(false)
          setUser(null)
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
      setIsLoggedIn(false)
      setUser(null)
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

  const logout = async () => {
    try {
      // Try to logout from backend
      await fetch('/logout', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        credentials: 'include',
      })
    } catch (error) {
      console.error("Backend logout failed:", error)
    } finally {
      // Always clear local state
      localStorage.removeItem("authToken")
      localStorage.removeItem("userData")
      setIsLoggedIn(false)
      setUser(null)
    }
  }

  return {
    isLoggedIn,
    user,
    loading,
    login,
    logout,
    checkAuthStatus,
    refresh: checkAuthStatus, // Alias for manual refresh
  }
}
