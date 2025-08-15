"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  Brain,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Shield,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Briefcase,
  Users,
  BookOpen,
  Target,
  Globe,
  MessageCircle,
  Star,
  Heart,
  Trophy,
} from "lucide-react"

interface StepData {
  // Step 1: Password Setup
  password: string
  confirmPassword: string

  // Step 2: Personal Information
  fullName: string
  dateOfBirth: string
  city: string
  occupation: string

  // Step 3: Educational Background
  educationLevel: string
  currentGrade: string
  subjects: string[]
  goals: string[]

  // Step 4: How did you hear about us
  referralSource: string
  referralDetails: string
}

export default function MultiStepRegistration() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [stepData, setStepData] = useState<StepData>({
    password: "",
    confirmPassword: "",
    fullName: "",
    dateOfBirth: "",
    city: "",
    occupation: "",
    educationLevel: "",
    currentGrade: "",
    subjects: [],
    goals: [],
    referralSource: "",
    referralDetails: "",
  })

  const totalSteps = 4

  const updateStepData = (field: keyof StepData, value: string | string[]) => {
    setStepData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const toggleArrayItem = (field: "subjects" | "goals", item: string) => {
    const currentArray = stepData[field]
    const newArray = currentArray.includes(item) ? currentArray.filter((i) => i !== item) : [...currentArray, item]
    updateStepData(field, newArray)
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!stepData.password || !stepData.confirmPassword) {
          setError("Parol va tasdiqlash parolini kiriting")
          return false
        }
        if (stepData.password !== stepData.confirmPassword) {
          setError("Parollar mos kelmaydi")
          return false
        }
        if (stepData.password.length < 6) {
          setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak")
          return false
        }
        break
      case 2:
        if (!stepData.fullName || !stepData.city) {
          setError("Majburiy maydonlarni to'ldiring")
          return false
        }
        break
      case 3:
        if (!stepData.educationLevel || stepData.subjects.length === 0) {
          setError("Ta'lim darajasi va kamida bitta fan tanlang")
          return false
        }
        break
      case 4:
        if (!stepData.referralSource) {
          setError("Bizni qayerdan eshitganingizni tanlang")
          return false
        }
        break
    }
    return true
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) return

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError("")
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)

    try {
      await fetch("/sanctum/csrf-cookie", {
        credentials: "include",
      })

      const response = await fetch("/api/profile/complete-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
        body: JSON.stringify({
          full_name: stepData.fullName,
          date_of_birth: stepData.dateOfBirth,
          city: stepData.city,
          occupation: stepData.occupation,
          education_level: stepData.educationLevel,
          current_grade: stepData.currentGrade,
          subjects: stepData.subjects,
          goals: stepData.goals,
          referral_source: stepData.referralSource,
          referral_details: stepData.referralDetails,
        }),
      })

      if (response.ok) {
        window.location.href = "/dashboard"
      } else {
        setError("Ma'lumotlarni saqlashda xatolik yuz berdi")
        setIsLoading(false)
      }
    } catch (err) {
      setError("Network error occurred")
      setIsLoading(false)
    }
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Parol o'rnatish"
      case 2:
        return "Shaxsiy ma'lumotlar"
      case 3:
        return "Ta'lim ma'lumotlari"
      case 4:
        return "Bizni qayerdan eshitdingiz?"
      default:
        return ""
    }
  }

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1:
        return "Hisobingiz uchun xavfsiz parol yarating"
      case 2:
        return "O'zingiz haqingizda ma'lumot bering"
      case 3:
        return "Ta'lim darajangiz va qiziqishlaringizni tanlang"
      case 4:
        return "Platformamizni qayerdan bilib qoldingiz?"
      default:
        return ""
    }
  }

  const educationLevels = [
    { value: "student", label: "O'quvchi (1-11 sinf)", icon: BookOpen },
    { value: "graduate", label: "Abituriyent", icon: GraduationCap },
    { value: "university", label: "Talaba", icon: Users },
    { value: "teacher", label: "O'qituvchi", icon: User },
    { value: "other", label: "Boshqa", icon: Briefcase },
  ]

  const subjects = [
    "Matematika",
    "Fizika",
    "Kimyo",
    "Biologiya",
    "Tarix",
    "Geografiya",
    "Adabiyot",
    "Ingliz tili",
    "Rus tili",
    "Informatika",
    "Iqtisod",
    "Huquq",
  ]

  const goals = [
    "OTM ga kirish",
    "Bilimni mustahkamlash",
    "Yangi fan o'rganish",
    "Imtihonga tayyorgarlik",
    "Karyera rivojlantirish",
    "Shaxsiy rivojlanish",
  ]

  const referralSources = [
    { value: "social_media", label: "Ijtimoiy tarmoqlar", icon: MessageCircle },
    { value: "friends", label: "Do'stlar tavsiyasi", icon: Users },
    { value: "search_engine", label: "Google/Yandex qidiruv", icon: Globe },
    { value: "advertisement", label: "Reklama", icon: Star },
    { value: "school", label: "Maktab/Universitet", icon: BookOpen },
    { value: "other", label: "Boshqa", icon: Heart },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            className="mb-6 text-gray-600 hover:text-gray-900"
            onClick={() => (window.location.href = "/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Bosh sahifaga qaytish
          </Button>

          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hisobni sozlash</h1>
          <p className="text-gray-600">Platformadan to'liq foydalanish uchun ma'lumotlaringizni to'ldiring</p>

          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 mt-4">
            <Brain className="h-4 w-4 mr-2" />
            {currentStep}/{totalSteps} - {getStepTitle(currentStep)}
            <Sparkles className="h-4 w-4 ml-2" />
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  i + 1 <= currentStep
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {i + 1 < currentStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="font-semibold">{i + 1}</span>
                )}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">{getStepTitle(currentStep)}</CardTitle>
            <CardDescription className="text-gray-600">{getStepDescription(currentStep)}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Step 1: Password Setup */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Yangi parol *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={stepData.password}
                      onChange={(e) => updateStepData("password", e.target.value)}
                      placeholder="Kamida 6 ta belgi"
                      className="pl-10 pr-10 h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Parolni tasdiqlang *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={stepData.confirmPassword}
                      onChange={(e) => updateStepData("confirmPassword", e.target.value)}
                      placeholder="Parolni takrorlang"
                      className="pl-10 pr-10 h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Xavfsiz parol yaratish uchun tavsiyalar:
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Kamida 6 ta belgi ishlatilsin</li>
                    <li>• Katta va kichik harflarni aralashtiring</li>
                    <li>• Raqam va maxsus belgilar qo'shing</li>
                    <li>• Oddiy so'zlardan foydalanmang</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    To'liq ismingiz *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      value={stepData.fullName}
                      onChange={(e) => updateStepData("fullName", e.target.value)}
                      placeholder="Ism Familiya"
                      className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                    Tug'ilgan sana
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={stepData.dateOfBirth}
                      onChange={(e) => updateStepData("dateOfBirth", e.target.value)}
                      className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium text-gray-700">
                    Shahar *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="city"
                      type="text"
                      value={stepData.city}
                      onChange={(e) => updateStepData("city", e.target.value)}
                      placeholder="Toshkent"
                      className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="occupation" className="text-sm font-medium text-gray-700">
                    Kasb/Faoliyat
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="occupation"
                      type="text"
                      value={stepData.occupation}
                      onChange={(e) => updateStepData("occupation", e.target.value)}
                      placeholder="O'quvchi, Talaba, Ishchi..."
                      className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Educational Background */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Ta'lim darajangiz *</label>
                  <div className="grid grid-cols-1 gap-3">
                    {educationLevels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => updateStepData("educationLevel", level.value)}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-300 ${
                          stepData.educationLevel === level.value
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <level.icon className="h-5 w-5" />
                        <span className="font-medium">{level.label}</span>
                        {stepData.educationLevel === level.value && (
                          <CheckCircle className="h-5 w-5 text-blue-600 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {stepData.educationLevel === "student" && (
                  <div className="space-y-2">
                    <label htmlFor="currentGrade" className="text-sm font-medium text-gray-700">
                      Hozirgi sinf
                    </label>
                    <select
                      id="currentGrade"
                      value={stepData.currentGrade}
                      onChange={(e) => updateStepData("currentGrade", e.target.value)}
                      className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors"
                    >
                      <option value="">Sinfni tanlang</option>
                      {Array.from({ length: 11 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}-sinf
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    Qiziqish fanlaringiz * (bir nechta tanlash mumkin)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {subjects.map((subject) => (
                      <button
                        key={subject}
                        type="button"
                        onClick={() => toggleArrayItem("subjects", subject)}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 text-sm ${
                          stepData.subjects.includes(subject)
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {subject}
                        {stepData.subjects.includes(subject) && <CheckCircle className="h-4 w-4 inline ml-2" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Maqsadlaringiz (ixtiyoriy)</label>
                  <div className="grid grid-cols-1 gap-2">
                    {goals.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => toggleArrayItem("goals", goal)}
                        className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-300 ${
                          stepData.goals.includes(goal)
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <Target className="h-4 w-4" />
                        <span className="text-sm">{goal}</span>
                        {stepData.goals.includes(goal) && <CheckCircle className="h-4 w-4 text-purple-600 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Referral Source */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Bizni qayerdan eshitdingiz? *</label>
                  <div className="grid grid-cols-1 gap-3">
                    {referralSources.map((source) => (
                      <button
                        key={source.value}
                        type="button"
                        onClick={() => updateStepData("referralSource", source.value)}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-300 ${
                          stepData.referralSource === source.value
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <source.icon className="h-5 w-5" />
                        <span className="font-medium">{source.label}</span>
                        {stepData.referralSource === source.value && (
                          <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {stepData.referralSource && (
                  <div className="space-y-2">
                    <label htmlFor="referralDetails" className="text-sm font-medium text-gray-700">
                      Qo'shimcha ma'lumot (ixtiyoriy)
                    </label>
                    <textarea
                      id="referralDetails"
                      value={stepData.referralDetails}
                      onChange={(e) => updateStepData("referralDetails", e.target.value)}
                      placeholder="Masalan: qaysi ijtimoiy tarmoq, do'stingizning ismi, qidiruv so'zi..."
                      rows={3}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                )}

                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 text-center">
                  <Trophy className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h4 className="font-bold text-green-800 mb-2">Deyarli tayyor!</h4>
                  <p className="text-green-700 text-sm">
                    Yana bir qadam qoldi va siz AI ta'lim platformasidan to'liq foydalanishingiz mumkin bo'ladi.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Orqaga</span>
              </Button>

              <div className="text-sm text-gray-500">
                {currentStep} / {totalSteps}
              </div>

              <Button
                type="button"
                onClick={handleNext}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Yakunlanmoqda...</span>
                  </>
                ) : currentStep === totalSteps ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Yakunlash</span>
                  </>
                ) : (
                  <>
                    <span>Keyingisi</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
