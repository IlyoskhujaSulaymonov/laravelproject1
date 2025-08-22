"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  GraduationCap,
  Brain,
  User,
  Settings,
  Lock,
  Eye,
  EyeOff,
  Bell,
  BookOpen,
  Trophy,
  Target,
  BarChart3,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Edit,
  Save,
  X,
  LogOut,
  Home,
  TrendingUp,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  Zap,
  Camera,
  Shield,
  Smartphone,
  Upload,
  Plus,
  Minus,
  Search,
  Menu,
  ChevronDown,
} from "lucide-react"

interface UserPlan {
  id: string
  plan_id: string
  name: string
  slug: string
  price: number
  duration: number
  description: string
  features: string[]
  assessments_limit: number
  lessons_limit: number
  ai_hints_limit: number
  subjects_limit: number
  starts_at: string
  ends_at: string | null
  is_active: boolean
}

interface UserData {
  id: string
  fullName: string
  email: string
  phone: string
  city: string // This stores region_id
  dateOfBirth: string
  occupation: string
  educationLevel: string
  currentGrade: string
  subjects: string[]
  goals: string[]
  avatar: string | File
  joinDate: string
  lastLogin: string
  emailVerifiedAt?: string
  createdAt: string
  updatedAt: string
  currentPlan?: UserPlan
}

export default function UserDashboard() {
  const [activeSection, setActiveSection] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [dataLoading, setDataLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [userData, setUserData] = useState<UserData>({
    id: "",
    fullName: "Aziz Abdullayev",
    email: "aziz.abdullayev@example.com",
    phone: "+998 90 123 45 67",
    city: "Toshkent",
    dateOfBirth: "",
    occupation: "Dasturchi",
    educationLevel: "university",
    currentGrade: "",
    subjects: [],
    goals: [],
    avatar: "/professional-avatar.png",
    joinDate: "",
    lastLogin: "",
    createdAt: "",
    updatedAt: "",
  })

  const [editData, setEditData] = useState({ ...userData })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [cities, setCities] = useState<{id: number, name: string}[]>([])
  const [loadingCities, setLoadingCities] = useState(false)
  const [newSubject, setNewSubject] = useState("")
  const [newGoal, setNewGoal] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)

  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true)
      try {
        const response = await fetch("/api/regions")
        if (response.ok) {
          const data = await response.json()

          const regions = data.regions || []
          // Store both ID and name for proper mapping
          const cityList = regions.map((region: any) => ({
            id: region.id,
            name: region.name || region.city || region.title
          }))
          setCities(cityList)
        } else {
          console.error(`API request failed with status: ${response.status}`)
        }
      } catch (error) {
        console.error("Shaharlarni yuklashda xatolik:", error)
      } finally {
        setLoadingCities(false)
      }
    }

    fetchCities()
  }, [])

  const occupationOptions = ["O'quvchi", "Talaba", "O'qituvchi", "Boshqa"]

  const educationLevelOptions = [
    { value: "student", label: "O'quvchi (1-11 sinf)" },
    { value: "graduate", label: "Abituriyent" },
    { value: "university", label: "Talaba" },
    { value: "teacher", label: "O'qituvchi" },
    { value: "other", label: "Boshqa" },
  ]

  // Functions for managing subjects and goals
  const addSubject = () => {
    if (newSubject.trim() && !editData.subjects.includes(newSubject.trim())) {
      setEditData({
        ...editData,
        subjects: [...editData.subjects, newSubject.trim()]
      })
      setNewSubject("")
    }
  }

  const removeSubject = (index: number) => {
    setEditData({
      ...editData,
      subjects: editData.subjects.filter((_, i) => i !== index)
    })
  }

  const addGoal = () => {
    if (newGoal.trim() && !editData.goals.includes(newGoal.trim())) {
      setEditData({
        ...editData,
        goals: [...editData.goals, newGoal.trim()]
      })
      setNewGoal("")
    }
  }

  const removeGoal = (index: number) => {
    setEditData({
      ...editData,
      goals: editData.goals.filter((_, i) => i !== index)
    })
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Rasm hajmi 5MB dan oshmasligi kerak")
        return
      }

      if (!file.type.startsWith("image/")) {
        setError("Faqat rasm fayllari ruxsat etilgan")
        return
      }

      setEditData({ ...editData, avatar: file })
    }
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    setError("")

    // Frontend validation
    if (!editData.fullName || editData.fullName.trim() === "") {
      setError("Ism maydoni majburiy")
      setIsLoading(false)
      return
    }

    try {
      // Fetch CSRF cookie first
      await fetch("/sanctum/csrf-cookie", {
        credentials: "include",
      })

      // Get CSRF token from meta tag
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')

      // Create FormData for file upload support
      const formData = new FormData()
      
      // Add method spoofing for PATCH request
      formData.append("_method", "PATCH")
      
      // Add user fields
      formData.append("name", editData.fullName || "")
      formData.append("email", userData.email) // Include email even though it's readonly
      formData.append("phone", editData.phone || "")
      
      // Add user_data fields
      formData.append("region_id", editData.city || "")
      formData.append("date_of_birth", editData.dateOfBirth || "")
      formData.append("occupation", editData.occupation || "")
      formData.append("education_level", editData.educationLevel || "university")
      formData.append("current_grade", editData.currentGrade || "")
      
      // Handle arrays properly for FormData
      if (editData.subjects && editData.subjects.length > 0) {
        editData.subjects.forEach((subject, index) => {
          formData.append(`subjects[${index}]`, subject)
        })
      } else {
        // Send empty array
        formData.append("subjects[]", "")
      }
      
      if (editData.goals && editData.goals.length > 0) {
        editData.goals.forEach((goal, index) => {
          formData.append(`goals[${index}]`, goal)
        })
      } else {
        // Send empty array
        formData.append("goals[]", "")
      }

      // Handle avatar file upload
      if (editData.avatar && editData.avatar instanceof File) {
        formData.append("avatar", editData.avatar)
      }

      // Add CSRF token to FormData
      if (csrfToken) {
        formData.append("_token", csrfToken)
      }

      const response = await fetch("/profile", {
        method: "POST", // Using POST with _method spoofing
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": csrfToken || "",
          // Don't set Content-Type for FormData - browser will set it automatically with boundary
        },
        credentials: "include",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        // Update userData with properly formatted data from server response
        if (data.data) {
          const updatedUserData: UserData = {
            id: data.data.id.toString(),
            fullName: data.data.name || editData.fullName,
            email: data.data.email || editData.email,
            phone: data.data.phone || editData.phone,
            city: data.data.user_data?.region_id?.toString() || editData.city,
            dateOfBirth: data.data.user_data?.date_of_birth ? new Date(data.data.user_data.date_of_birth).toISOString().split("T")[0] : editData.dateOfBirth,
            occupation: data.data.user_data?.occupation || editData.occupation,
            educationLevel: data.data.user_data?.education_level || editData.educationLevel,
            currentGrade: data.data.user_data?.current_grade || editData.currentGrade,
            subjects: data.data.user_data?.subjects || editData.subjects,
            goals: data.data.user_data?.goals || editData.goals,
            avatar: data.data.avatar ? `/storage/${data.data.avatar}` : (editData.avatar instanceof File ? editData.avatar : editData.avatar),
            joinDate: userData.joinDate,
            lastLogin: userData.lastLogin,
            emailVerifiedAt: data.data.email_verified_at || userData.emailVerifiedAt,
            createdAt: userData.createdAt,
            updatedAt: data.data.updated_at || userData.updatedAt,
            currentPlan: data.data.current_plan ? {
              id: data.data.current_plan.id.toString(),
              plan_id: data.data.current_plan.plan_id.toString(),
              name: data.data.current_plan.name,
              slug: data.data.current_plan.slug,
              price: data.data.current_plan.price,
              duration: data.data.current_plan.duration,
              description: data.data.current_plan.description,
              features: data.data.current_plan.features || [],
              assessments_limit: data.data.current_plan.assessments_limit,
              lessons_limit: data.data.current_plan.lessons_limit,
              ai_hints_limit: data.data.current_plan.ai_hints_limit,
              subjects_limit: data.data.current_plan.subjects_limit,
              starts_at: data.data.current_plan.starts_at,
              ends_at: data.data.current_plan.ends_at,
              is_active: data.data.current_plan.is_active,
            } : userData.currentPlan,
          }
          setUserData(updatedUserData)
          setEditData(updatedUserData)
        } else {
          setUserData({ ...editData })
        }
        setIsEditing(false)
        setSuccess("Profil muvaffaqiyatli yangilandi!")
        setTimeout(() => setSuccess(""), 5000) // Auto-hide success message after 5 seconds
        setTimeout(() => fetchUserData(), 1000)
      } else {
        // Handle validation errors
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(", ")
          setError(errorMessages)
        } else {
          setError(data.message || "Profilni yangilashda xatolik")
        }
      }
    } catch (err) {
      console.error("Profile update error:", err)
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
      setTimeout(() => setError(""), 5000)
    }
  }

  const fetchUserData = async () => {
    try {
      setDataLoading(true)

      await fetch("/sanctum/csrf-cookie", {
        credentials: "include",
      })

      const response = await fetch("/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
      })

      if (response.ok) {
        const responseText = await response.text()

        let data
        try {
          data = JSON.parse(responseText)
        } catch (parseError) {
          console.error("[v0] Failed to parse JSON response:", responseText)
          throw new Error("Server returned invalid JSON response")
        }

        const mappedUserData: UserData = {
          id: data.data.id.toString(),
          fullName: data.data.name || "",
          email: data.data.email || "",
          phone: data.data.phone || "",
          city: data.data.user_data?.region_id?.toString() || "", // Get region_id from user_data
          dateOfBirth: data.data.user_data?.date_of_birth ? new Date(data.data.user_data.date_of_birth).toISOString().split("T")[0] : "",
          occupation: data.data.user_data?.occupation || "",
          educationLevel: data.data.user_data?.education_level || "university",
          currentGrade: data.data.user_data?.current_grade || "",
          subjects: data.data.user_data?.subjects || ["Matematika", "Fizika", "Informatika"],
          goals: data.data.user_data?.goals || ["OTM ga kirish", "Bilimni mustahkamlash"],
          avatar: data.data.avatar ? `/storage/${data.data.avatar}` : "",
          joinDate: data.data.created_at ? new Date(data.data.created_at).toISOString().split("T")[0] : "",
          lastLogin: data.data.last_login_at ? new Date(data.data.last_login_at).toISOString().split("T")[0] : "",
          emailVerifiedAt: data.data.email_verified_at,
          createdAt: data.data.created_at || "",
          updatedAt: data.data.updated_at || "",
          currentPlan: data.data.current_plan ? {
            id: data.data.current_plan.id.toString(),
            plan_id: data.data.current_plan.plan_id.toString(),
            name: data.data.current_plan.name,
            slug: data.data.current_plan.slug,
            price: data.data.current_plan.price,
            duration: data.data.current_plan.duration,
            description: data.data.current_plan.description,
            features: data.data.current_plan.features || [],
            assessments_limit: data.data.current_plan.assessments_limit,
            lessons_limit: data.data.current_plan.lessons_limit,
            ai_hints_limit: data.data.current_plan.ai_hints_limit,
            subjects_limit: data.data.current_plan.subjects_limit,
            starts_at: data.data.current_plan.starts_at,
            ends_at: data.data.current_plan.ends_at,
            is_active: data.data.current_plan.is_active,
          } : undefined,
        }

        setUserData(mappedUserData)
        setEditData(mappedUserData)
      } else {
        setError("Foydalanuvchi ma'lumotlarini yuklashda xatolik")
      }
    } catch (err) {
      setError("Tarmoq xatosi yuz berdi")
      console.error("Error fetching user data:", err)
    } finally {
      setDataLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('[data-dropdown]')) {
        setShowNotifications(false)
        setShowUserMenu(false)
        setShowQuickActions(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Qidirish"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }
      // Escape to close dropdowns
      if (event.key === 'Escape') {
        setShowNotifications(false)
        setShowUserMenu(false)
        setShowQuickActions(false)
        setIsMobileMenuOpen(false)
      }
    }
    
    document.addEventListener('keydown', handleKeyboard)
    return () => document.removeEventListener('keydown', handleKeyboard)
  }, [])

  const stats = {
    testsCompleted: 45,
    averageScore: 87,
    studyHours: 124,
    achievements: 12,
    currentStreak: 7,
    totalPoints: 2450,
    accountAge: userData.createdAt
      ? Math.floor((new Date().getTime() - new Date(userData.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0,
  }

  const recentActivities = [
    { id: 1, type: "test", title: "Matematika testi", score: 92, date: "2024-12-08" },
    { id: 2, type: "lesson", title: "Fizika darsi", progress: 100, date: "2024-12-07" },
    { id: 3, type: "achievement", title: "7 kunlik seriya", badge: "streak", date: "2024-12-07" },
    { id: 4, type: "test", title: "Informatika testi", score: 85, date: "2024-12-06" },
  ]

  const sidebarItems = [
    { id: "overview", label: "Umumiy ko'rinish", icon: Home },
    { id: "profile", label: "Profil", icon: User },
    { id: "progress", label: "O'sish", icon: TrendingUp },
    { id: "tests", label: "Testlar", icon: BookOpen },
    { id: "achievements", label: "Yutuqlar", icon: Trophy },
    { id: "settings", label: "Sozlamalar", icon: Settings },
    { id: "security", label: "Xavfsizlik", icon: Shield },
  ]

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError("Barcha maydonlarni to'ldiring")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Yangi parollar mos kelmaydi")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak")
      return
    }

    setIsLoading(true)

    try {
      await fetch("/sanctum/csrf-cookie", {
        credentials: "include",
      })

      // Get CSRF token from meta tag
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')

      const response = await fetch("/profile/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": csrfToken || "",
        },
        credentials: "include",
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          password: passwordData.newPassword,
          password_confirmation: passwordData.confirmPassword,
          _token: csrfToken,
        }),
      })

      const responseText = await response.text()
      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("[v0] Failed to parse password response:", responseText)
        throw new Error("Server returned invalid response")
      }

      if (response.ok) {
        setSuccess("Parol muvaffaqiyatli o'zgartirildi!")
        setTimeout(() => setSuccess(""), 5000) // Auto-hide success message after 5 seconds
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        setError(data.message || "Parolni o'zgartirishda xatolik")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    const csrfTokenElement = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement
    const csrfToken = csrfTokenElement?.content || ''

    try {
      await fetch("/logout", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
      })
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      window.location.href = "/"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "test":
        return BookOpen
      case "lesson":
        return Brain
      case "achievement":
        return Trophy
      default:
        return CheckCircle
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Xush kelibsiz, {userData.fullName ? userData.fullName.split(" ")[0] : "Foydalanuvchi"}!
            </h2>
            <p className="text-blue-100 text-lg">Bugun ham yangi bilimlar olishga tayyormisiz?</p>
            <p className="text-blue-200 text-sm mt-2">Hisob ochilgan: {stats.accountAge} kun oldin</p>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <Brain className="h-12 w-12" />
          </div>
        </div>
      </div>

      {/* Current Plan Section */}
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-indigo-800">
            <GraduationCap className="h-6 w-6" />
            <span>Joriy tarif rejasi</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userData.currentPlan ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-indigo-900">{userData.currentPlan.name}</h3>
                  <p className="text-indigo-600 mt-1">{userData.currentPlan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-indigo-800">
                    {userData.currentPlan.price > 0 ? `$${userData.currentPlan.price}` : "Bepul"}
                  </div>
                  <div className="text-sm text-indigo-600">
                    {userData.currentPlan.duration > 0 ? `${userData.currentPlan.duration} kun` : "Cheksiz"}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="bg-white p-3 rounded-lg border border-indigo-100">
                  <div className="text-sm text-gray-600">Testlar</div>
                  <div className="text-lg font-semibold text-indigo-800">
                    {userData.currentPlan.assessments_limit === -1 ? "Cheksiz" : userData.currentPlan.assessments_limit}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-indigo-100">
                  <div className="text-sm text-gray-600">Darslar</div>
                  <div className="text-lg font-semibold text-indigo-800">
                    {userData.currentPlan.lessons_limit === -1 ? "Cheksiz" : userData.currentPlan.lessons_limit}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-indigo-100">
                  <div className="text-sm text-gray-600">AI yordami</div>
                  <div className="text-lg font-semibold text-indigo-800">
                    {userData.currentPlan.ai_hints_limit === -1 ? "Cheksiz" : userData.currentPlan.ai_hints_limit}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-indigo-100">
                  <div className="text-sm text-gray-600">Fanlar</div>
                  <div className="text-lg font-semibold text-indigo-800">
                    {userData.currentPlan.subjects_limit === -1 ? "Cheksiz" : userData.currentPlan.subjects_limit}
                  </div>
                </div>
              </div>
              
              {userData.currentPlan.features && userData.currentPlan.features.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-indigo-800 mb-2">Xususiyatlar:</h4>
                  <div className="flex flex-wrap gap-2">
                    {userData.currentPlan.features.map((feature, index) => (
                      <Badge key={index} className="bg-indigo-100 text-indigo-800">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-indigo-200">
                <div>
                  <div className="text-sm text-gray-600">Boshlangan sana</div>
                  <div className="font-medium text-indigo-800">
                    {userData.currentPlan.starts_at ? new Date(userData.currentPlan.starts_at).toLocaleDateString('uz-UZ') : "Ma'lum emas"}
                  </div>
                  {userData.currentPlan.ends_at && (
                    <>
                      <div className="text-sm text-gray-600 mt-2">Tugash sanasi</div>
                      <div className="font-medium text-indigo-800">
                        {new Date(userData.currentPlan.ends_at).toLocaleDateString('uz-UZ')}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${
                    userData.currentPlan.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {userData.currentPlan.is_active ? "Faol" : "Faol emas"}
                  </Badge>
                  <Button 
                    onClick={() => window.open('https://t.me/your_bot_username', '_blank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Yangi rejani olish
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">Hech qanday faol reja yo'q</h3>
              <p className="text-indigo-600 mb-4">Ta'lim rejasini tanlang va o'qishni boshlang!</p>
              <Button 
                onClick={() => window.open('https://t.me/your_bot_username', '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Reja tanlash
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {dataLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 text-center">
                <div className="bg-gray-200 w-16 h-16 rounded-full mx-auto mb-4"></div>
                <div className="bg-gray-200 h-8 w-16 mx-auto mb-2 rounded"></div>
                <div className="bg-gray-200 h-4 w-24 mx-auto rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.testsCompleted}</div>
              <div className="text-gray-600">Bajarilgan testlar</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.averageScore}%</div>
              <div className="text-gray-600">O'rtacha ball</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.studyHours}</div>
              <div className="text-gray-600">O'qish soatlari</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.achievements}</div>
              <div className="text-gray-600">Yutuqlar</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.currentStreak}</div>
              <div className="text-gray-600">Kunlik seriya</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-pink-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalPoints}</div>
              <div className="text-gray-600">Umumiy ochko</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>So'nggi faoliyat</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const IconComponent = getActivityIcon(activity.type)
              return (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.score && <Badge className="bg-green-100 text-green-800">{activity.score}%</Badge>}
                    {activity.progress && <Badge className="bg-blue-100 text-blue-800">Yakunlandi</Badge>}
                    {activity.badge && <Badge className="bg-yellow-100 text-yellow-800">Yangi yutuq!</Badge>}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderProfile = () => (
    <div className="space-y-6">
      {dataLoading ? (
        <Card>
          <CardContent className="p-6 animate-pulse">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profil ma'lumotlari</CardTitle>
                <CardDescription>Shaxsiy ma'lumotlaringizni boshqaring</CardDescription>
              </div>
              <Button
                onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}
                variant={isEditing ? "outline" : "default"}
                className="flex items-center space-x-2 text-white"
              >
                {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                <span>{isEditing ? "Bekor qilish" : "Tahrirlash"}</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-700 text-sm">{success}</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={
                    editData.avatar
                      ? editData.avatar instanceof File
                        ? URL.createObjectURL(editData.avatar)
                        : editData.avatar.startsWith('http') || editData.avatar.startsWith('/storage')
                        ? editData.avatar
                        : editData.avatar
                        ? `/storage/${editData.avatar}`
                        : "/placeholder.svg"
                      : "/placeholder.svg"
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
                {isEditing && (
                  <div className="absolute bottom-0 right-0 flex space-x-1">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                      title="Rasm yuklash"
                    >
                      <Upload className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                      title="Rasm o'zgartirish"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">{userData.fullName || "Foydalanuvchi"}</h3>
                <p className="text-gray-600">{userData.email}</p>
                <Badge className="mt-2 bg-blue-100 text-blue-800">
                  {educationLevelOptions.find(level => level.value === userData.educationLevel)?.label || userData.educationLevel}
                </Badge>
                {userData.emailVerifiedAt && (
                  <Badge className="mt-2 ml-2 bg-green-100 text-green-800">Email tasdiqlangan</Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">To'liq ism</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <Input
                    value={isEditing ? editData.fullName : userData.fullName}
                    onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                    disabled={!isEditing}
                    className="!pl-10 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    value={userData.email}
                    disabled={true}
                    className="!pl-10 bg-gray-50 cursor-not-allowed font-medium text-black"
                    title="Email o'zgartirib bo'lmaydi"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Email manzilini o'zgartirish uchun administrator bilan bog'laning
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Telefon</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    value={isEditing ? editData.phone : userData.phone}
                    onChange={handlePhoneChange}
                    disabled={!isEditing}
                    className="!pl-10 font-medium "
                    placeholder="+998 XX XXX XX XX"
                    maxLength={17}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-lg font-medium text-gray-700">Shahar</label>
                {isEditing ? (
                  <Select
                    value={editData.city?.toString() || ""}
                    onValueChange={(value) => setEditData({ ...editData, city: value })}
                    disabled={loadingCities}
                  >
                    <SelectTrigger className="w-96 bg-gray-100">
                      <SelectValue placeholder={loadingCities ? "Yuklanmoqda..." : "Shaharni tanlang"} />
                    </SelectTrigger>
                    <SelectContent className="w-96 bg-gray-100">
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      value={cities.find(c => c.id.toString() === userData.city)?.name || userData.city} 
                      disabled={true} 
                      className="!pl-10 w-64 font-medium text-black" 
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tug'ilgan sana</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="date"
                    value={isEditing ? editData.dateOfBirth : userData.dateOfBirth}
                    onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                    disabled={!isEditing}
                    className="!pl-10 font-medium "
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Kasb</label>
                {isEditing ? (
                  <Select
                    value={editData.occupation}
                    onValueChange={(value) => setEditData({ ...editData, occupation: value })}
                  >
                    <SelectTrigger className="w-96">
                      <SelectValue placeholder="Kasbni tanlang" />
                    </SelectTrigger>
                    <SelectContent className="w-96">
                      {occupationOptions.map((occupation) => (
                        <SelectItem key={occupation} value={occupation}>
                          {occupation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={userData.occupation} disabled={true} className="w-64 font-medium text-black" />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ta'lim darajasi</label>
                {isEditing ? (
                  <Select
                    value={editData.educationLevel}
                    onValueChange={(value) => setEditData({ ...editData, educationLevel: value })}
                  >
                    <SelectTrigger className="w-96">
                      <SelectValue placeholder="Ta'lim darajasini tanlang" />
                    </SelectTrigger>
                    <SelectContent className="w-96 bg-gray-100">
                      {educationLevelOptions.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input 
                    value={educationLevelOptions.find(level => level.value === userData.educationLevel)?.label || userData.educationLevel} 
                    disabled={true} 
                    className="w-64 font-medium text-black" 
                  />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Qiziqish fanlaringiz</label>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {editData.subjects.map((subject, index) => (
                        <Badge key={index} className="bg-blue-100 text-blue-800 flex items-center gap-1">
                          {subject}
                          <button
                            onClick={() => removeSubject(index)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                            type="button"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder="Yangi fan qo'shish"
                        className="flex-1 font-medium text-gray-900"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addSubject()
                          }
                        }}
                      />
                      <Button
                        onClick={addSubject}
                        type="button"
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Qo'shish
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {userData.subjects.map((subject, index) => (
                      <Badge key={index} className="bg-blue-100 text-blue-800">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Maqsadlaringiz</label>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {editData.goals.map((goal, index) => (
                        <Badge key={index} className="bg-purple-100 text-purple-800 flex items-center gap-1">
                          {goal}
                          <button
                            onClick={() => removeGoal(index)}
                            className="ml-1 text-purple-600 hover:text-purple-800"
                            type="button"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="Yangi maqsad qo'shish"
                        className="flex-1 font-medium text-gray-900"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addGoal()
                          }
                        }}
                      />
                      <Button
                        onClick={addGoal}
                        type="button"
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Qo'shish
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {userData.goals.map((goal, index) => (
                      <Badge key={index} className="bg-purple-100 text-purple-800">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Bekor qilish
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saqlanmoqda...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-white">
                      <Save className="h-4 w-4" />
                      <span>Saqlash</span>
                    </div>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderSecurity = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Parolni o'zgartirish</span>
          </CardTitle>
          <CardDescription>Hisobingiz xavfsizligi uchun parolni muntazam o'zgartiring</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3 mb-6">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3 mb-6">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Joriy parol</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Joriy parolingizni kiriting"
                  className="!pl-10 pr-10 font-medium text-gray-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Yangi parol</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Yangi parolingizni kiriting"
                  className="!pl-10 font-medium text-gray-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Yangi parolni tasdiqlang</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Yangi parolni takrorlang"
                  className="!pl-10 pr-10 font-medium text-gray-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>O'zgartirilmoqda...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-white">
                  <Shield className="h-4 w-4" />
                  <span>Parolni o'zgartirish</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Hisob xavfsizligi</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`flex items-center justify-between p-4 rounded-lg ${
              userData.emailVerifiedAt ? "bg-green-50" : "bg-yellow-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className={`h-5 w-5 ${userData.emailVerifiedAt ? "text-green-600" : "text-yellow-600"}`} />
              <div>
                <h4 className={`font-semibold ${userData.emailVerifiedAt ? "text-green-800" : "text-yellow-800"}`}>
                  {userData.emailVerifiedAt ? "Email tasdiqlangan" : "Email tasdiqlanmagan"}
                </h4>
                <p className={`text-sm ${userData.emailVerifiedAt ? "text-green-600" : "text-yellow-600"}`}>
                  {userData.email}
                </p>
              </div>
            </div>
            <Badge
              className={userData.emailVerifiedAt ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
            >
              {userData.emailVerifiedAt ? "Faol" : "Kutilmoqda"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-semibold text-blue-800">Telefon raqam</h4>
                <p className="text-sm text-blue-600">{userData.phone || "Kiritilmagan"}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              {userData.phone ? "Tasdiqlash" : "Qo'shish"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview()
      case "profile":
        return renderProfile()
      case "security":
        return renderSecurity()
      case "progress":
        return (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">O'sish bo'limi</h3>
            <p className="text-gray-500">Tez orada...</p>
          </div>
        )
      case "tests":
        return (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Testlar bo'limi</h3>
            <p className="text-gray-500">Tez orada...</p>
          </div>
        )
      case "achievements":
        return (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Yutuqlar bo'limi</h3>
            <p className="text-gray-500">Tez orada...</p>
          </div>
        )
      case "settings":
        return (
          <div className="text-center py-12">
            <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Sozlamalar bo'limi</h3>
            <p className="text-gray-500">Tez orada...</p>
          </div>
        )
      default:
        return renderOverview()
    }
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // If starts with 998, format as +998 XX XXX XX XX
    if (digits.startsWith("998")) {
      const match = digits.match(/^998(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})$/)
      if (match) {
        return `+998 ${match[1]}${match[2] ? " " + match[2] : ""}${match[3] ? " " + match[3] : ""}${match[4] ? " " + match[4] : ""}`.trim()
      }
    }

    // If doesn't start with 998, add it and format
    if (digits.length > 0 && !digits.startsWith("998")) {
      const withCountryCode = "998" + digits
      const match = withCountryCode.match(/^998(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})$/)
      if (match) {
        return `+998 ${match[1]}${match[2] ? " " + match[2] : ""}${match[3] ? " " + match[3] : ""}${match[4] ? " " + match[4] : ""}`.trim()
      }
    }

    return value
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setEditData({ ...editData, phone: formatted })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header with gradient background */}
      <header className="bg-gradient-to-r from-white via-blue-50 to-purple-50 shadow-xl border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Enhanced Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <GraduationCap className="h-9 w-9 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ta'lim Tizimi</h1>
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">AI Dashboard</span>
                  <div className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Online
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Search Bar with suggestions */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <Input
                  type="text"
                  placeholder="Qidirish... (Ctrl + K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 pr-20 py-3 border border-gray-200 rounded-xl leading-5 bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-black shadow-sm hover:shadow-md transition-all duration-200"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchQuery('')
                    }
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-12 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-600">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>

            {/* Enhanced Right side actions */}
            <div className="flex items-center space-x-2">
              {/* Mobile menu button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden hover:bg-blue-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Quick Actions */}
              <div className="relative hidden lg:block" data-dropdown>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span className="ml-1 text-sm font-medium">Yangi</span>
                </Button>
                
                {/* Quick Actions Dropdown */}
                {showQuickActions && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900">Tez amallar</h3>
                    </div>
                    <div className="py-2">
                      <button className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 w-full text-left transition-colors">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <span>Yangi test yaratish</span>
                      </button>
                      <button className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 w-full text-left transition-colors">
                        <Target className="h-4 w-4 text-green-600" />
                        <span>Maqsad qo'shish</span>
                      </button>
                      <button className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 w-full text-left transition-colors">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span>Dars jadvali</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Notifications */}
              <div className="relative" data-dropdown>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowNotifications(!showNotifications)
                    if (!showNotifications && notificationCount > 0) {
                      setNotificationCount(0) // Mark as read when opened
                    }
                  }}
                  className="relative hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-200"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <>
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-semibold animate-pulse">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-400 rounded-full animate-ping opacity-75"></span>
                    </>
                  )}
                </Button>
                
                {/* Enhanced Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Bildirishnomalar</h3>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            3 ta yangi
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setShowNotifications(false)}
                            className="h-6 w-6 p-0 hover:bg-gray-200"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <div className="p-4 hover:bg-blue-50 border-b border-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-start space-x-3">
                          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl shadow-sm">
                            <Trophy className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">Yangi yutuq qo'lga kiritildi! 🎉</p>
                            <p className="text-sm text-gray-600 mt-1">Siz 7 kunlik o'qish seriyasini yakunladingiz va 50 ochko oldingiz</p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-400">2 soat oldin</p>
                              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 hover:bg-green-50 border-b border-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-start space-x-3">
                          <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-xl shadow-sm">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">Test muvaffaqiyatli yakunlandi!</p>
                            <p className="text-sm text-gray-600 mt-1">Matematika testida 92% ball oldingiz. A'lo natija!</p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-400">4 soat oldin</p>
                              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 hover:bg-purple-50 transition-colors cursor-pointer">
                        <div className="flex items-start space-x-3">
                          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-xl shadow-sm">
                            <BookOpen className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">Yangi darslar mavjud</p>
                            <p className="text-sm text-gray-600 mt-1">Fizika bo'limida yangi video darslar va mashqlar qo'shildi</p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-400">1 kun oldin</p>
                              <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1 text-sm hover:bg-white">
                          Barchasini belgilash
                        </Button>
                        <Button className="flex-1 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                          Barchasini ko'rish
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced User Menu */}
              <div className="relative" data-dropdown>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 hover:bg-blue-50 transition-all duration-200 p-2 rounded-xl"
                >
                  <div className="relative">
                    <img
                      src={
                        userData.avatar
                          ? userData.avatar.startsWith('http') || userData.avatar.startsWith('/storage')
                            ? userData.avatar
                            : `/storage/${userData.avatar}`
                          : "/placeholder.svg"
                      }
                      alt="Profile"
                      className="w-9 h-9 rounded-xl object-cover border-2 border-white shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 hidden lg:block">
                    {userData.fullName ? userData.fullName.split(' ')[0] : "Foydalanuvchi"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400 hidden lg:block" />
                </Button>

                {/* Enhanced User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    {/* User Info Header */}
                    <div className="p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border-b border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={
                              userData.avatar
                                ? userData.avatar.startsWith('http') || userData.avatar.startsWith('/storage')
                                  ? userData.avatar
                                  : `/storage/${userData.avatar}`
                                : "/placeholder.svg"
                            }
                            alt="Profile"
                            className="w-16 h-16 rounded-xl object-cover border-3 border-white shadow-lg"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-bold text-gray-900">{userData.fullName || "Foydalanuvchi"}</p>
                          <p className="text-sm text-gray-600 mb-1">{userData.email}</p>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                              {educationLevelOptions.find(level => level.value === userData.educationLevel)?.label || 'Talaba'}
                            </Badge>
                            {userData.emailVerifiedAt && (
                              <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                                ✓ Tasdiqlangan
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="p-4 bg-gray-50 border-b border-gray-100">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-blue-600">{stats.testsCompleted}</p>
                          <p className="text-xs text-gray-600">Testlar</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-green-600">{stats.averageScore}%</p>
                          <p className="text-xs text-gray-600">O'rtacha</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-purple-600">{stats.currentStreak}</p>
                          <p className="text-xs text-gray-600">Seriya</p>
                        </div>
                      </div>
                    </div>
                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setActiveSection('profile')
                          setShowUserMenu(false)
                        }}
                        className="flex items-center space-x-3 px-6 py-3 text-sm text-gray-700 hover:bg-blue-50 w-full text-left transition-colors group"
                      >
                        <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium">Profil</span>
                          <p className="text-xs text-gray-500">Shaxsiy ma'lumotlar</p>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setActiveSection('progress')
                          setShowUserMenu(false)
                        }}
                        className="flex items-center space-x-3 px-6 py-3 text-sm text-gray-700 hover:bg-green-50 w-full text-left transition-colors group"
                      >
                        <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium">O'sish</span>
                          <p className="text-xs text-gray-500">Natijalar va statistika</p>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setActiveSection('settings')
                          setShowUserMenu(false)
                        }}
                        className="flex items-center space-x-3 px-6 py-3 text-sm text-gray-700 hover:bg-purple-50 w-full text-left transition-colors group"
                      >
                        <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                          <Settings className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium">Sozlamalar</span>
                          <p className="text-xs text-gray-500">Tizim sozlamalari</p>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setActiveSection('security')
                          setShowUserMenu(false)
                        }}
                        className="flex items-center space-x-3 px-6 py-3 text-sm text-gray-700 hover:bg-orange-50 w-full text-left transition-colors group"
                      >
                        <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                          <Shield className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium">Xavfsizlik</span>
                          <p className="text-xs text-gray-500">Parol va xavfsizlik</p>
                        </div>
                      </button>
                      <hr className="my-3" />
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          handleLogout()
                        }}
                        className="flex items-center space-x-3 px-6 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors group"
                      >
                        <div className="bg-red-100 p-2 rounded-lg group-hover:bg-red-200 transition-colors">
                          <LogOut className="h-4 w-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium">Chiqish</span>
                          <p className="text-xs text-red-500">Hisobdan chiqish</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium text-black"
              />
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center space-x-2 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Testlar</span>
                </button>
                <button className="flex items-center space-x-2 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                  <Trophy className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Yutuqlar</span>
                </button>
                <button className="flex items-center space-x-2 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">O'sish</span>
                </button>
                <button className="flex items-center space-x-2 p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors">
                  <Settings className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">Sozlamalar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="w-64 flex-shrink-0">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <nav className="space-y-2">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeSection === item.id
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}
