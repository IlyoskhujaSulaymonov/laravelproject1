"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"

interface UserData {
  id: string
  fullName: string
  email: string
  phone: string
  city: string
  dateOfBirth: string
  occupation: string
  educationLevel: string
  currentGrade: string
  subjects: string[]
  goals: string[]
  avatar: string
  joinDate: string
  lastLogin: string
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

  // Mock user data
  const [userData, setUserData] = useState<UserData>({
    id: "user123",
    fullName: "Akmal Karimov",
    email: "akmal@example.com",
    phone: "+998 90 123 45 67",
    city: "Toshkent",
    dateOfBirth: "2000-05-15",
    occupation: "Talaba",
    educationLevel: "university",
    currentGrade: "",
    subjects: ["Matematika", "Fizika", "Informatika"],
    goals: ["OTM ga kirish", "Bilimni mustahkamlash"],
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "2024-01-15",
    lastLogin: "2024-12-08",
  })

  const [editData, setEditData] = useState({ ...userData })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Mock statistics
  const stats = {
    testsCompleted: 45,
    averageScore: 87,
    studyHours: 124,
    achievements: 12,
    currentStreak: 7,
    totalPoints: 2450,
  }

  // Mock recent activities
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

  const handleSaveProfile = async () => {
    setIsLoading(true)
    setError("")

    try {
      await fetch("/sanctum/csrf-cookie", {
        credentials: "include",
      })

      const response = await fetch("/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
        body: JSON.stringify({
          name: editData.fullName,
          email: editData.email,
          phone: editData.phone,
          city: editData.city,
          date_of_birth: editData.dateOfBirth,
          occupation: editData.occupation,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setUserData({ ...editData })
        setIsEditing(false)
        setSuccess("Profil muvaffaqiyatli yangilandi!")
      } else {
        setError(data.message || "Profilni yangilashda xatolik")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
      setTimeout(() => setSuccess(""), 3000)
    }
  }

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

      const response = await fetch("/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          password: passwordData.newPassword,
          password_confirmation: passwordData.confirmPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Parol muvaffaqiyatli o'zgartirildi!")
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        setError(data.message || "Parolni o'zgartirishda xatolik")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
      setTimeout(() => setSuccess(""), 3000)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/logout", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Xush kelibsiz, {userData.fullName.split(" ")[0]}!</h2>
            <p className="text-blue-100 text-lg">Bugun ham yangi bilimlar olishga tayyormisiz?</p>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <Brain className="h-12 w-12" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
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

      {/* Recent Activities */}
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
              className="flex items-center space-x-2"
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

          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={userData.avatar || "/placeholder.svg"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold">{userData.fullName}</h3>
              <p className="text-gray-600">{userData.email}</p>
              <Badge className="mt-2 bg-blue-100 text-blue-800">{userData.educationLevel}</Badge>
            </div>
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">To'liq ism</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={isEditing ? editData.fullName : userData.fullName}
                  onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={isEditing ? editData.email : userData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Telefon</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={isEditing ? editData.phone : userData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Shahar</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={isEditing ? editData.city : userData.city}
                  onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
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
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Kasb</label>
              <Input
                value={isEditing ? editData.occupation : userData.occupation}
                onChange={(e) => setEditData({ ...editData, occupation: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Subjects and Goals */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Qiziqish fanlaringiz</label>
              <div className="flex flex-wrap gap-2">
                {userData.subjects.map((subject, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-800">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Maqsadlaringiz</label>
              <div className="flex flex-wrap gap-2">
                {userData.goals.map((goal, index) => (
                  <Badge key={index} className="bg-purple-100 text-purple-800">
                    {goal}
                  </Badge>
                ))}
              </div>
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
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Saqlash</span>
                  </div>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
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
                  className="pl-10 pr-10"
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
                  className="pl-10 pr-10"
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
                  className="pl-10 pr-10"
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
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Parolni o'zgartirish</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Security Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Hisob xavfsizligi</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800">Email tasdiqlangan</h4>
                <p className="text-sm text-green-600">{userData.email}</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">Faol</Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-semibold text-blue-800">Telefon raqam</h4>
                <p className="text-sm text-blue-600">{userData.phone}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Tasdiqlash
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-600" />
              <div>
                <h4 className="font-semibold text-gray-800">Oxirgi kirish</h4>
                <p className="text-sm text-gray-600">{userData.lastLogin}</p>
              </div>
            </div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Ta'lim Tizimi</h1>
                <p className="text-sm text-gray-600 flex items-center">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
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

          {/* Main Content */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}
