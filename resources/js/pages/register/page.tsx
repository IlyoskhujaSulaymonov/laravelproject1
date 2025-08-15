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
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  Sparkles,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
} from "lucide-react"

export default function RegisterPage() {
  const [step, setStep] = useState<"register" | "verify">("register")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Registration form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    terms: false,
  })

  // Verification data
  const [verificationCode, setVerificationCode] = useState("")
  const [resendTimer, setResendTimer] = useState(0)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // If starts with 998, format as +998 XX XXX XX XX
    if (digits.startsWith("998")) {
      const formatted = digits.slice(0, 11) // Limit to 11 digits (998 + 8 digits)
      return `+${formatted.slice(0, 3)} ${formatted.slice(3, 5)} ${formatted.slice(5, 8)} ${formatted.slice(8, 10)} ${formatted.slice(10, 12)}`.trim()
    }

    // If starts with +998, keep it
    if (value.startsWith("+998")) {
      const digitsOnly = value.replace(/[^\d]/g, "").slice(3) // Remove +998 and non-digits
      const formatted = digitsOnly.slice(0, 8) // Limit to 8 digits after 998
      return `+998 ${formatted.slice(0, 2)} ${formatted.slice(2, 5)} ${formatted.slice(5, 7)} ${formatted.slice(7, 9)}`.trim()
    }

    // Default formatting for other numbers
    return value.slice(0, 17) // Limit length
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value)
    handleInputChange("phone", formatted)
  }

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.password_confirmation || !formData.name) {
      setError("Barcha majburiy maydonlarni to'ldiring")
      return false
    }

    if (formData.password !== formData.password_confirmation) {
      setError("Parollar mos kelmaydi")
      return false
    }

    if (formData.password.length < 6) {
      setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Email manzil noto'g'ri formatda")
      return false
    }

    if (!formData.terms) {
      setError("Foydalanish shartlariga rozimangiz kerak")
      return false
    }

    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    try {
      // Get CSRF token
      await fetch("/sanctum/csrf-cookie", {
        credentials: "include",
      })

      // Submit to Laravel register route
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
        body: JSON.stringify({
          name: `${formData.name}`.trim(),
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          phone: formData.phone,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Ro'yxatdan o'tish muvaffaqiyatli! Email tasdiqlash uchun xat yuborildi.")
        // Check if email verification is required
        if (data.message?.includes("verification")) {
          setStep("verify")
        } else {
          // Redirect to multi-step registration
          setTimeout(() => {
            window.location.href = "/register/steps"
          }, 1500)
        }
      } else {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(", ")
          setError(errorMessages)
        } else {
          setError(data.message || "Registration failed")
        }
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!verificationCode || verificationCode.length !== 6) {
      setError("6 raqamli tasdiqlash kodini kiriting")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/email/verification-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
        body: JSON.stringify({
          verification_code: verificationCode,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Email manzil tasdiqlandi!")
        setTimeout(() => {
          window.location.href = "/register/steps"
        }, 1500)
      } else {
        setError(data.message || "Tasdiqlash kodi noto'g'ri")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialRegister = (provider: string) => {
    setIsLoading(true)
    window.location.href = `/auth/${provider}/redirect`
  }

  const handleResendCode = async () => {
    if (resendTimer > 0) return

    setIsLoading(true)
    setError("")

    try {
      // Logic to resend the verification code
      const response = await fetch("/email/resend-verification-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Tasdiqlash kodi qayta yuborildi!")
        setResendTimer(30) // Set timer for 30 seconds
        const timer = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        setError(data.message || "Kodni qayta yuborishda xato")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-25 via-white to-purple-25 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-48 h-48 bg-blue-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <Button
            variant="ghost"
            className="mb-3 text-gray-600 hover:text-gray-900 text-sm"
            onClick={() => (window.location.href = "/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Bosh sahifaga qaytish
          </Button>

          <div className="flex items-center justify-center mb-3">
           <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1 pl-5">
                 {step === "register" ? "Ro'yxatdan o'tish" : "Email tasdiqlash"}
            </h1>
          </div>

          <p className="text-gray-600 text-sm mb-3">
            {step === "register" ? "AI ta'lim platformasiga qo'shiling" : "Emailingizga yuborilgan kodni kiriting"}
          </p>
        </div>

        {/* Registration/Verification Form */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
          <CardHeader className="text-center pb-3">
            <CardTitle className="text-xl font-bold text-gray-900">
              {step === "register" ? "Yangi hisob yaratish" : "Tasdiqlash kodi"}
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              {step === "register"
                ? "Ma'lumotlaringizni kiriting yoki ijtimoiy tarmoq orqali ro'yxatdan o'ting"
                : `Tasdiqlash kodi ${formData.email} manziliga yuborildi`}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-3">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-700 text-sm">{success}</span>
              </div>
            )}

            {step === "register" ? (
              <>
                {/* Registration Form */}
                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Ism va Familiya *
                    </label>
                    <div className="relative">
                     
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Ismingiz va Familiyangiz"
                        className="pl-9 h-10 border border-gray-200 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email manzil *
                    </label>
                    <div className="relative">
                    
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="example@email.com"
                        className="pl-9 h-10 border border-gray-200 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Telefon raqam
                    </label>
                    <div className="relative">
                     
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="+998 90 123 45 67"
                        className="pl-9 h-10 border border-gray-200 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Parol *
                    </label>
                    <div className="relative">
                    
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Kamida 6 ta belgi"
                        className="pl-9 pr-9 h-10 border border-gray-200 focus:border-blue-500 transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
                      Parolni tasdiqlang *
                    </label>
                    <div className="relative">
                    
                      <Input
                        id="password_confirmation"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.password_confirmation}
                        onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
                        placeholder="Parolni takrorlang"
                        className="pl-9 pr-9 h-10 border border-gray-200 focus:border-blue-500 transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Ro'yxatdan o'tish...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Ro'yxatdan o'tish</span>
                      </div>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">yoki</span>
                  </div>
                </div>

                {/* Social Registration */}
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialRegister("google")}
                    disabled={isLoading}
                    className="w-full h-10 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google bilan ro'yxatdan o'tish
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialRegister("facebook")}
                      disabled={isLoading}
                      className="h-10 border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                    >
                      <svg className="h-4 w-4 mr-1" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialRegister("telegram")}
                      disabled={isLoading}
                      className="h-10 border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                    >
                      <svg className="h-4 w-4 mr-1" fill="#0088CC" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                      Telegram
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Email Verification Form */}
                <form onSubmit={handleVerification} className="space-y-4">
                  <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Mail className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">6 raqamli tasdiqlash kodini kiriting</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="verificationCode" className="text-sm font-medium text-gray-700">
                      Tasdiqlash kodi
                    </label>
                    <Input
                      id="verificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="123456"
                      className="text-center text-xl font-mono h-12 border border-gray-200 focus:border-blue-500 transition-colors tracking-widest"
                      maxLength={6}
                      required
                    />
                    <p className="text-xs text-gray-500 text-center">Demo uchun: 123456 kodini kiriting</p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || verificationCode.length !== 6}
                    className="w-full h-10 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Tekshirilmoqda...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Tasdiqlash</span>
                      </div>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-gray-600 mb-2 text-sm">Kod kelmadimi?</p>
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleResendCode}
                      disabled={resendTimer > 0 || isLoading}
                      className="text-blue-600 hover:text-blue-700 p-0 text-sm"
                    >
                      {resendTimer > 0 ? `Qayta yuborish (${resendTimer}s)` : "Qayta yuborish"}
                    </Button>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("register")}
                    className="w-full text-gray-600 hover:text-gray-900 h-9"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Orqaga qaytish
                  </Button>
                </form>
              </>
            )}

            {step === "register" && (
              <>
                {/* Login Link */}
                <div className="text-center pt-3 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    Hisobingiz bormi?{" "}
                    <Button
                      variant="link"
                      className="text-blue-600 hover:text-blue-700 p-0 font-medium text-sm"
                      onClick={() => (window.location.href = "/login")}
                    >
                      Kirish
                    </Button>
                  </p>
                </div>


              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
