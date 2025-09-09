"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import PurchasePlanModal from "@/components/PurchasePlanModal"
import {
  GraduationCap,
  BookOpen,
  Trophy,
  PlayCircle,
  CheckCircle,
  MessageCircle,
  Award,
  ChevronDown,
  Brain,
  Star,
  BarChart3,
  Shield,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Play,
  UserCheck,
  User,
  LogOut,
} from "lucide-react"
import AIAssistant from "@/components/ai-assistant"

export default function EducationLanding() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [scrollY, setScrollY] = useState(0)
  const [studentCount, setStudentCount] = useState(0)
  const [testCount, setTestCount] = useState(0)
  const [accuracyCount, setAccuracyCount] = useState(0)
  const [email, setEmail] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileNav, setShowMobileNav] = useState(false)
  const [availablePlans, setAvailablePlans] = useState<
    Array<{
      id: string
      plan_id: string
      name: string
      slug: string
      description: string
      price: number
      duration: number
      features: string[]
      assessments_limit: number
      lessons_limit: number
      ai_hints_limit: number
      subjects_limit: number
    }>
  >([])
  const [selectedPlan, setSelectedPlan] = useState<{
    id: string
    plan_id: string
    name: string
    slug: string
    description: string
    price: number
    duration: number
    features: string[]
    assessments_limit: number
    lessons_limit: number
    ai_hints_limit: number
    subjects_limit: number
  } | null>(null)
  const [plansLoading, setPlansLoading] = useState(false)
  const [currentPlanSlug, setCurrentPlanSlug] = useState<string | null>(null)
  const [showPlanModal, setShowPlanModal] = useState(false)

  const { isLoggedIn, user, loading, logout } = useAuth()

  useEffect(() => {
    const studentTimer = setInterval(() => {
      setStudentCount((prev) => (prev < 10000 ? prev + 100 : 10000))
    }, 50)

    const testTimer = setInterval(() => {
      setTestCount((prev) => (prev < 50000 ? prev + 500 : 50000))
    }, 30)

    const accuracyTimer = setInterval(() => {
      setAccuracyCount((prev) => (prev < 95 ? prev + 1 : 95))
    }, 100)

    return () => {
      clearInterval(studentTimer)
      clearInterval(testTimer)
      clearInterval(accuracyTimer)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest("[data-dropdown]")) {
        setShowUserMenu(false)
        setIsMenuOpen(false)
      }
      if (!target.closest("[data-plan-modal]")) {
        setShowPlanModal(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    fetchAvailablePlans()
  }, [])

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
      setIsMenuOpen(false)
      setShowMobileNav(false)
    }
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Newsletter subscription:", email)
    setEmail("")
  }

  const handleLogout = async () => {
    try {
      await logout()
      window.location.href = "/"
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  const fetchAvailablePlans = async () => {
    setPlansLoading(true)
    try {
      // Fetch CSRF cookie first
      await fetch("/sanctum/csrf-cookie", {
        credentials: "include",
      })

      // Get CSRF token
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")

      const response = await fetch("/api/plans", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": csrfToken || "",
        },
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setAvailablePlans(data.data)
        }
      }

      // If user is logged in, fetch their current plan
      if (isLoggedIn && user) {
        try {
          const planResponse = await fetch("/api/user-plan/current", {
            method: "GET",
            headers: {
              Accept: "application/json",
              "X-Requested-With": "XMLHttpRequest",
              "X-CSRF-TOKEN": csrfToken || "",
            },
            credentials: "include",
          })

          if (planResponse.ok) {
            const planData = await planResponse.json()
            if (planData.success && planData.data) {
              setCurrentPlanSlug(planData.data.slug)
            }
          }
        } catch (error) {
          console.error("Error fetching current plan:", error)
        }
      }
    } catch (error) {
      console.error("Error fetching plans:", error)
    } finally {
      setPlansLoading(false)
    }
  }

  const handlePlanSelection = async (plan: (typeof availablePlans)[0]) => {
    if (!isLoggedIn) {
      window.location.href = "/login"
      return
    }

    setSelectedPlan(plan)
    setShowPlanModal(true)
  }

  const handleSelectPlan = (plan: (typeof availablePlans)[0]) => {
    if (plan.slug !== currentPlanSlug) {
      setSelectedPlan(plan)
    }
  }

  const navItems = [
    { id: "home", label: "Bosh sahifa", icon: GraduationCap },
    { id: "features", label: "AI Imkoniyatlar", icon: Brain },
    { id: "sections", label: "Bo'limlar", icon: BookOpen },
    { id: "advantages", label: "Afzalliklar", icon: Star },
    { id: "pricing", label: "Narxlar", icon: Trophy },
    { id: "contact", label: "Bog'lanish", icon: MessageCircle },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header with Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50 ? "bg-card/95 backdrop-blur-md shadow-lg border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Enhanced Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => scrollToSection("home")}>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <GraduationCap className="h-8 w-8 text-white group-hover:animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                  Ta'lim Tizimi
                </h1>
                <p className="text-xs text-muted-foreground flex items-center group-hover:text-blue-600 transition-colors duration-300">
                  <Brain className="h-3 w-3 mr-1 group-hover:animate-spin" />
                  AI bilan bilim olish
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                      : scrollY > 50
                        ? "text-foreground hover:text-primary hover:bg-muted hover:shadow-md"
                        : "text-foreground hover:text-primary hover:bg-card/20 hover:shadow-md"
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-muted-foreground">Yuklanmoqda...</span>
                </div>
              ) : isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <DropdownMenu open={showUserMenu} onOpenChange={setShowUserMenu}>
                    <DropdownMenuTrigger asChild>
                      <div data-dropdown>
                        <Button
                          variant="outline"
                          className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold bg-transparent shadow-lg hover:shadow-xl"
                        >
                          <User className="h-4 w-4 mr-2" />
                          {user?.name || "Profil"}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl"
                    >
                      <DropdownMenuItem className="hover:bg-blue-50 cursor-pointer">
                        <a href="/user/dashboard" className="flex items-center w-full">
                          <BarChart3 className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="font-medium">Dashboard</span>
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-green-50 cursor-pointer">
                        <a href="/user/profile" className="flex items-center w-full">
                          <User className="h-4 w-4 mr-2 text-green-600" />
                          <span className="font-medium">Profil</span>
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="hover:bg-red-50 cursor-pointer border-t border-gray-100 mt-1"
                      >
                        <LogOut className="h-4 w-4 mr-2 text-red-600" />
                        <span className="font-medium text-red-600">Chiqish</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold bg-transparent"
                    onClick={() => (window.location.href = "/login")}
                  >
                    Kirish
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    onClick={() => (window.location.href = "/register")}
                  >
                    Ro'yxatdan o'tish
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Navigation Button */}
            <button
              className="lg:hidden flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={() => setShowMobileNav(!showMobileNav)}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {showMobileNav && (
        <nav className="fixed top-20 left-0 right-0 z-40 bg-card/95 backdrop-blur-md shadow-lg border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center space-y-4 py-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id)
                    setShowMobileNav(false)
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                      : "text-foreground hover:text-primary hover:bg-muted hover:shadow-md"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-border space-y-3 w-full">
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2 text-sm text-muted-foreground">Yuklanmoqda...</span>
                  </div>
                ) : isLoggedIn ? (
                  <div className="space-y-3">
                    <div className="text-center py-2">
                      <p className="text-sm font-medium text-gray-700">{user?.name || "Foydalanuvchi"}</p>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full justify-start border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold bg-transparent"
                      asChild
                    >
                      <a href="/user/dashboard">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Dashboard
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold bg-transparent"
                      asChild
                    >
                      <a href="/user/profile">
                        <User className="h-4 w-4 mr-2" />
                        Profil
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 font-semibold bg-transparent"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Chiqish
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold bg-transparent"
                      onClick={() => (window.location.href = "/login")}
                    >
                      Kirish
                    </Button>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      onClick={() => (window.location.href = "/register")}
                    >
                      Ro'yxatdan o'tish
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Hero Section */}
      <section
        id="home"
        className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Animated Badge */}
            <div className="flex items-center justify-center mb-8">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 text-lg animate-bounce">
                <Brain className="h-5 w-5 mr-2" />
                Sun'iy Intellekt Texnologiyasi
                <Sparkles className="h-4 w-4 ml-2" />
              </Badge>
            </div>

            {/* Main Heading */}
            <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8">
              Zamonaviy Ta'lim Tizimi
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                AI Yordamida
              </span>
            </h2>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto">
              O'quvchilar va abituriyentlar uchun sun'iy intellekt texnologiyasi bilan ishlab chiqilgan interaktiv
              ta'lim platformasi. Darajangizni AI yordamida aniqlang, bilimingizni mustahkamlang va maqsadingizga
              erishing!
            </p>

            {/* Interactive Stats */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <div className="text-4xl font-bold text-blue-600 mb-2">{studentCount.toLocaleString()}+</div>
                <div className="text-gray-600">Faol O'quvchilar</div>
                <div className="w-full bg-blue-100 rounded-full h-2 mt-3">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(studentCount / 10000) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <div className="text-4xl font-bold text-green-600 mb-2">{accuracyCount}%</div>
                <div className="text-gray-600">AI Aniqlik Darajasi</div>
                <div className="w-full bg-green-100 rounded-full h-2 mt-3">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${accuracyCount}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <div className="text-4xl font-bold text-purple-600 mb-2">{testCount.toLocaleString()}+</div>
                <div className="text-gray-600">Bajarilgan Testlar</div>
                <div className="w-full bg-purple-100 rounded-full h-2 mt-3">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(testCount / 50000) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xl px-10 py-6 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl group"
              >
                <Brain className="h-6 w-6 mr-3 group-hover:animate-pulse" />
                AI Test Boshlash
                <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-xl px-10 py-6 bg-white/80 backdrop-blur-sm hover:bg-white transform hover:scale-105 transition-all shadow-lg hover:shadow-xl group border-2 border-blue-200 hover:border-blue-400"
              >
                <PlayCircle className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                Demo ko'rish
                <Play className="h-4 w-4 ml-3" />
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-70">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">SSL Himoyalangan</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Tasdiqlangan Platform</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">Sertifikatlangan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-20 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-10 left-10 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-20 w-3 h-3 bg-white/30 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-20 w-5 h-5 bg-white/20 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold mb-6">AI Platformaning Kuchi</h3>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Sun'iy intellekt texnologiyasi bilan ta'lim sohasida inqilob yaratmoqdamiz
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI Daraja Aniqlash",
                description: "Sun'iy intellekt yordamida aniq daraja baholash",
                features: ["25 ta maxsus test", "Real-time tahlil", "Aniq natijalar"],
              },
              {
                icon: BarChart3,
                title: "Shaxsiy Ta'lim Yo'li",
                description: "AI sizning ehtiyojlaringizga moslashtirilgan dastur",
                features: ["Individual yondashuv", "Adaptiv o'qitish", "Maqsadli tayyorgarlik"],
              },
              {
                icon: Trophy,
                title: "Tezkor Natijalar",
                description: "Darhol tahlil va tavsiyalar olish",
                features: ["Instant feedback", "24/7 mavjudlik", "Tezkor javoblar"],
              },
            ].map((feature, index) => (
              <div key={index} className="group">
                <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                  <CardContent className="p-8 text-center">
                    <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-10 w-10" />
                    </div>
                    <h4 className="text-2xl font-bold mb-4">{feature.title}</h4>
                    <p className="text-white/90 mb-6">{feature.description}</p>
                    <div className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-300" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sections" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">Ta'lim Bo'limlari</h3>
            <p className="text-xl text-gray-600">
              O'zingizga mos bo'limni tanlang va AI yordamida ta'lim jarayonini boshlang
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* O'quvchi Bo'limi */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-2 hover:border-blue-200 relative overflow-hidden transform hover:scale-105">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-pulse">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Enhanced
                </Badge>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:animate-spin"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-full group-hover:animate-bounce">
                      <BookOpen className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">I. O'quvchi Bo'limi</CardTitle>
                      <CardDescription className="text-green-100">1-11 sinf o'quvchilari uchun</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 relative z-10">
                <div className="space-y-4">
                  {[
                    "AI yordamida sinflar bo'yicha taqsimlangan ta'lim materiallari",
                    "Har bir mavzu uchun interaktiv video darsliklar",
                    "10 ta amaliy misol va aqlli testlar",
                    "AI avtomatik tekshiruv va natija tahlili",
                    "Abituriyent bo'limiga silliq o'tish",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0 group-hover:animate-pulse" />
                      <p className="text-gray-700">{feature}</p>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all group"
                  onClick={() => toggleSection("student")}
                >
                  <BookOpen className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                  O'quvchi bo'limiga kirish
                  {expandedSection === "student" ? (
                    <ChevronDown className="h-4 w-4 ml-2 group-hover:animate-bounce" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-2 group-hover:animate-bounce" />
                  )}
                </Button>

                {expandedSection === "student" && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                      <Brain className="h-4 w-4 mr-2 animate-pulse" />
                      AI O'quvchi bo'limi jarayoni:
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-green-700">
                      {[
                        "AI yordamida o'zingizga mos sinfni tanlang",
                        "Mavzular ro'yxatidan kerakli mavzuni toping",
                        "Interaktiv video darslikni tomosha qiling",
                        "AI nazorati ostida 10 ta misolni ketma-ket ishlang",
                        "Aqlli testlarni bajaring (10 ta)",
                        "AI tahlili va shaxsiy tavsiyalar oling",
                      ].map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Abituriyent Bo'limi */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-2 hover:border-purple-200 relative overflow-hidden transform hover:scale-105">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white animate-pulse">
                  <Trophy className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:animate-spin"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-full group-hover:animate-bounce">
                      <GraduationCap className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">II. Abituriyent Bo'limi</CardTitle>
                      <CardDescription className="text-purple-100">AI bilan OTM ga tayyorgarlik</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 relative z-10">
                <div className="space-y-6">
                  <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Trophy className="h-5 w-5 mr-2 text-blue-600 animate-pulse" />
                        Asosiy Fan Yo'nalishi
                      </h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleSection("main")}
                        className="hover:scale-110 transition-transform"
                      >
                        {expandedSection === "main" ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {expandedSection === "main" && (
                      <div className="space-y-3 text-sm">
                        <div className="bg-white p-3 rounded border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                          <p className="font-medium text-blue-800 flex items-center">
                            <Brain className="h-4 w-4 mr-2 animate-pulse" />
                            AI 4 bosqichli daraja baholash:
                          </p>
                          <ul className="mt-2 space-y-1 text-blue-700">
                            {[
                              "1-bosqich: Past daraja (0-56%) - AI maxsus dastur",
                              "2-bosqich: Qoniqarli daraja (57-75%) - AI tavsiyalar",
                              "3-bosqich: Yaxshi daraja (76-88%) - AI mustahkamlash",
                              "4-bosqich: A'lo daraja (89-100%) - AI ilg'or dastur",
                            ].map((level, index) => (
                              <li key={index}>• {level}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <Button className="w-full mt-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all group">
                      <Brain className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                      AI Daraja Aniqlash Testi
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="advantages" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">AI Platformaning Afzalliklari</h3>
            <p className="text-xl text-gray-600">Nima uchun bizning sun'iy intellekt tizimimiz eng yaxshi tanlov?</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: "AI Daraja Baholash",
                description: "Sun'iy intellekt yordamida aniq va obyektiv baholash",
              },
              {
                icon: Trophy,
                title: "Aqlli Tavsiyalar",
                description: "AI sizning ehtiyojlaringizga moslashtirilgan tavsiyalar",
              },
              {
                icon: BarChart3,
                title: "O'sish Kuzatuvi",
                description: "AI yordamida rivojlanish jarayonini kuzatish",
              },
              {
                icon: Star,
                title: "Tezkor Javoblar",
                description: "AI darhol tahlil va javob berish imkoniyati",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
              >
                <CardContent className="p-8">
                  <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-10 w-10 text-blue-600" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">Narxlar</h3>
            <p className="text-xl text-gray-600">O'zingizga mos narx rejasini tanlang</p>
          </div>

          {plansLoading ? (
            <div className="text-center py-16">
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-lg text-gray-600">Rejalar yuklanmoqda...</p>
            </div>
          ) : availablePlans.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availablePlans.map((plan, index) => {
                const isCurrentPlan = currentPlanSlug === plan.slug
                return (
                  <Card
                    key={plan.id}
                    className={`relative overflow-hidden group transition-all duration-300 ${
                      isCurrentPlan
                        ? "ring-2 ring-green-500 bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-lg cursor-default"
                        : "hover:shadow-xl hover:scale-105 border-2 hover:border-blue-200 bg-white cursor-pointer"
                    }`}
                  >
                    {isCurrentPlan && (
                      <div className="absolute top-0 right-0 w-0 h-0 border-t-[50px] border-r-[50px] border-t-green-500 border-r-transparent z-20">
                        <CheckCircle className="absolute -top-10 -right-10 h-4 w-4 text-white" />
                      </div>
                    )}

                    {!isCurrentPlan && index === 1 && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 animate-pulse">
                          <Star className="h-3 w-3 mr-1" />
                          Mashhur
                        </Badge>
                      </div>
                    )}

                    <CardHeader
                      className={`text-center pb-4 relative z-10 ${
                        isCurrentPlan ? "bg-gradient-to-r from-green-100/80 to-emerald-100/80" : ""
                      }`}
                    >
                      <CardTitle
                        className={`text-3xl font-bold mb-2 ${isCurrentPlan ? "text-green-800" : "text-gray-900"}`}
                      >
                        {plan.name}
                        {isCurrentPlan && (
                          <div className="flex items-center justify-center mt-2">
                            <span className="inline-flex items-center text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-200">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Faol reja
                            </span>
                          </div>
                        )}
                      </CardTitle>
                      <div className="mb-4">
                        <span className={`text-4xl font-bold ${isCurrentPlan ? "text-green-600" : "text-blue-600"}`}>
                          {plan.price === 0 ? "Bepul" : plan.price.toLocaleString()}
                        </span>
                        {plan.price > 0 && <span className="text-lg text-gray-600 ml-1">so'm</span>}
                        <div className="text-sm text-gray-500">{plan.duration} kun</div>
                      </div>
                      <CardDescription className={`text-base ${isCurrentPlan ? "text-green-700" : "text-gray-600"}`}>
                        {plan.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-6 pt-0">
                      <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className={`h-4 w-4 ${isCurrentPlan ? "text-green-600" : "text-green-500"}`} />
                            <span className={isCurrentPlan ? "text-green-700 font-medium" : "text-gray-700"}>
                              {plan.assessments_limit} test
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className={`h-4 w-4 ${isCurrentPlan ? "text-green-600" : "text-green-500"}`} />
                            <span className={isCurrentPlan ? "text-green-700 font-medium" : "text-gray-700"}>
                              {plan.lessons_limit} dars
                            </span>
                          </div>
                        </div>

                        {plan.features && plan.features.length > 0 && (
                          <div className="space-y-2">
                            <h5 className={`font-semibold mb-2 ${isCurrentPlan ? "text-green-800" : "text-gray-900"}`}>
                              Qo'shimcha imkoniyatlar:
                            </h5>
                            <ul className="space-y-2">
                              {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center space-x-2 text-sm">
                                  <CheckCircle
                                    className={`h-4 w-4 flex-shrink-0 ${isCurrentPlan ? "text-green-600" : "text-green-500"}`}
                                  />
                                  <span className={isCurrentPlan ? "text-green-700" : "text-gray-700"}>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {isCurrentPlan ? (
                        <Button
                          disabled
                          className="w-full bg-green-100 text-green-800 border-2 border-green-300 cursor-not-allowed font-semibold py-3 hover:bg-green-100"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Faol reja - Ishlatilmoqda
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handlePlanSelection(plan)}
                          className={`w-full transform hover:scale-105 transition-all font-semibold py-3 shadow-md hover:shadow-lg ${
                            index === 1
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          <Trophy className="h-4 w-4 mr-2" />
                          {isLoggedIn ? "Rejani Tanlash" : "Kirish va Tanlash"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600 mb-4">Rejalar yuklanmadi</p>
              <Button onClick={fetchAvailablePlans} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Trophy className="h-4 w-4 mr-2" />
                Qayta Yuklash
              </Button>
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">Bog'lanish</h3>
            <p className="text-xl text-gray-600">Savollaringiz bormi? Biz bilan bog'laning</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-2xl font-bold mb-4">Aloqa Ma'lumotlari</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                  <span>ai@talimtizimi.uz</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Trophy className="h-6 w-6 text-green-600" />
                  <span>+998 (90) 123-45-67</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Brain className="h-6 w-6 text-purple-600" />
                  <span>24/7 AI yordam xizmati</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-2xl font-bold mb-4">So'rov Yuborish</h4>
              <form className="space-y-4" onSubmit={handleNewsletterSubmit}>
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                    Ismingiz
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Ismingizni kiriting"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Emailingizni kiriting"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                    Xabar
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Xabaringizni kiriting"
                  ></textarea>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 transition-all"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Yuborish
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-white/20 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* Newsletter Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-16 text-center">
            <h3 className="text-3xl font-bold mb-4">Yangiliklar va AI Maslahatlar</h3>
            <p className="text-lg mb-6 text-blue-100">
              Eng so'nggi AI ta'lim yangiliklari va maxsus takliflardan xabardor bo'ling
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email manzilingizni kiriting"
                className="flex-1 px-4 py-2 rounded-lg bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <Button type="submit" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                <MessageCircle className="h-4 w-4 mr-2" />
                Obuna bo'lish
              </Button>
            </form>
          </div>

          {/* Main Footer Content */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Ta'lim Tizimi</h3>
                  <p className="text-gray-400 flex items-center">
                    <Brain className="h-3 w-3 mr-1" />
                    AI bilan bilim olish
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Sun'iy intellekt texnologiyalari bilan zamonaviy ta'lim olish va rivojlanish platformasi. Bizning
                maqsadimiz - har bir o'quvchi va abituriyentga sifatli ta'lim imkoniyatini taqdim etish.
              </p>
            </div>

            {/* AI Bo'limlar */}
            <div>
              <h4 className="text-lg font-bold mb-6 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-400" />
                AI Bo'limlar
              </h4>
              <ul className="space-y-3">
                {[
                  "AI O'quvchi bo'limi",
                  "AI Abituriyent bo'limi",
                  "AI Daraja aniqlash",
                  "AI Tahlil va hisobotlar",
                  "AI Shaxsiy mentor",
                ].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Yordam */}
            <div>
              <h4 className="text-lg font-bold mb-6 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-purple-400" />
                Yordam
              </h4>
              <ul className="space-y-3">
                {["AI Qo'llanma", "FAQ", "Texnik yordam", "Bog'lanish", "Maxfiylik siyosati"].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>&copy; 2024 Ta'lim Tizimi. Barcha huquqlar himoyalangan.</span>
              </div>

              <div className="flex items-center space-x-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Tizim faol
                </Badge>
              </div>
            </div>
          </div>

          {/* Floating Back to Top Button */}
          <button
            onClick={() => scrollToSection("home")}
            className="fixed bottom-24 right-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-40"
          >
            <ArrowRight className="h-5 w-5 rotate-[-90deg]" />
          </button>
        </div>
      </footer>

      {/* AI Assistant Component */}
      <AIAssistant />
      
      <PurchasePlanModal
        isOpen={showPlanModal}
        onClose={() => {
          setShowPlanModal(false)
          setSelectedPlan(null)
        }}
        availablePlans={availablePlans}
        plansLoading={plansLoading}
        currentPlanSlug={currentPlanSlug || undefined}
        onPlanSelect={handleSelectPlan}
        selectedPlan={selectedPlan}
      />
    </div>
  )
}
