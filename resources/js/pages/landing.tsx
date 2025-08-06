"use client"

import type React from "react"
import ReactDOM from 'react-dom/client';

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import AIAssistant from "@/components/ai-assistant"
import {
  GraduationCap,
  BookOpen,
  Users,
  Trophy,
  Target,
  PlayCircle,
  CheckCircle,
  MessageCircle,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  Brain,
  Zap,
  TrendingUp,
  Star,
  Lightbulb,
  BarChart3,
  Rocket,
  Shield,
  Smartphone,
  PieChart,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Play,
  UserCheck,
  Search,
  Globe,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Send,
  FileText,
  HelpCircle,
  Settings,
  ChevronRight,
  ExternalLink,
} from "lucide-react"

export default function EducationLanding() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [scrollY, setScrollY] = useState(0)
  const [studentCount, setStudentCount] = useState(0)
  const [testCount, setTestCount] = useState(0)
  const [accuracyCount, setAccuracyCount] = useState(0)
  const [email, setEmail] = useState("")

  // Animated counters
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

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
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
    }
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email)
    setEmail("")
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header with Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50
          ? "bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/50"
          : "bg-white/90 backdrop-blur-sm shadow-lg"
          }`}
      >
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between py-3 text-sm border-b border-gray-200/30 dark:border-gray-700/30 bg-white dark:bg-gray-800 transition-colors duration-200">
            {/* Contact Info */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 lg:gap-6 text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" aria-hidden="true" />
                <a
                  href="tel:+998901234567"
                  className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  aria-label="Phone number"
                >
                  +998 (90) 123-45-67
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <a
                  href="mailto:info@talimtizimi.uz"
                  className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  aria-label="Email address"
                >
                  info@talimtizimi.uz
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span>24/7 AI Yordam</span>
              </div>
            </div>

            {/* Language and Social Links */}
            <div className="flex flex-wrap justify-center lg:justify-end items-center gap-4 lg:gap-6 mt-3 lg:mt-0">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-600 dark:text-gray-300" aria-hidden="true" />
                <select
                  className="bg-transparent text-gray-600 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-md"
                  aria-label="Select language"
                >
                  <option>O'zbek</option>
                  <option>Русский</option>
                  <option>English</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook page"
                >
                  <Facebook className="h-4 w-4 text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram page"
                >
                  <Instagram className="h-4 w-4 text-pink-600 hover:text-pink-700 dark:text-pink-500 dark:hover:text-pink-400 cursor-pointer transition-colors" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube channel"
                >
                  <Youtube className="h-4 w-4 text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 cursor-pointer transition-colors" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                >
                  <Linkedin className="h-4 w-4 text-blue-700 hover:text-blue-800 dark:text-blue-600 dark:hover:text-blue-500 cursor-pointer transition-colors" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                  onClick={() => window.location.href = window.Laravel.loginUrl}
                >
                  Tizimga kirish
                </button>
              </div>
            </div>
          </div>


          {/* Main Navigation */}
          <div className="flex items-center justify-between py-4">
            {/* Enhanced Logo */}
            <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => scrollToSection("home")}>
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  AI ustoz
                </h1>

              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 font-medium relative group ${activeSection === item.id
                    ? "text-blue-600 bg-blue-50 shadow-md"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/50"
                    }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {activeSection === item.id && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              ))}
            </nav>

            {/* Search and Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Qidirish..."
                  className="pl-10 pr-4 py-2 w-48 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 transition-all"
                />
              </div>

              {/* Status Badge */}
              {/* <Badge
                variant="outline"
                className="animate-pulse bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 text-green-700 px-3 py-1"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="font-medium">Onlayn</span>
              </Badge> */}

              {/* CTA Buttons */}
              <Button className="bg-gradient-to-r from-blue-600 text-white to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl">
                <Rocket className="h-4 w-4 mr-2" />
                Bepul Boshlash
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden pb-4 border-t border-gray-200/30 animate-in slide-in-from-top-2">
              {/* Mobile Search */}
              <div className="relative mt-4 mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Qidirish..."
                  className="pl-10 pr-4 py-2 w-full bg-gray-50 border-gray-200"
                />
              </div>

              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${activeSection === item.id ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </button>
                ))}

                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Play className="h-4 w-4 mr-2" />
                    Demo ko'rish
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Rocket className="h-4 w-4 mr-2" />
                    Bepul Boshlash
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section id="home" className="pt-40 pb-20 px-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Animated Badge */}
            <div className="flex items-center justify-center mb-8 animate-in fade-in-50 slide-in-from-top-4">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 text-lg animate-bounce">
                <Brain className="h-5 w-5 mr-2" />
                Sun'iy Intellekt Texnologiyasi
                <Sparkles className="h-4 w-4 ml-2" />
              </Badge>
            </div>

            {/* Main Heading with Animation */}
            <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 animate-in fade-in-50 slide-in-from-bottom-4 delay-200">
              Zamonaviy Ta'lim Tizimi
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x">
                AI Yordamida
              </span>
            </h2>

            {/* Enhanced Description */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto animate-in fade-in-50 slide-in-from-bottom-4 delay-300">
              O'quvchilar va abituriyentlar uchun sun'iy intellekt texnologiyasi bilan ishlab chiqilgan interaktiv
              ta'lim platformasi. Darajangizni AI yordamida aniqlang, bilimingizni mustahkamlang va maqsadingizga
              erishing!
            </p>

            {/* Interactive Stats */}
            <div className="grid md:grid-cols-3 gap-8 mb-12 animate-in fade-in-50 slide-in-from-bottom-4 delay-400">
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

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in fade-in-50 slide-in-from-bottom-4 delay-500">
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
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-70 animate-in fade-in-50 slide-in-from-bottom-4 delay-700">
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

      {/* Enhanced AI Features Banner */}
      <section
        id="features"
        className="py-20 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-10 left-10 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-20 w-3 h-3 bg-white/30 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-20 w-5 h-5 bg-white/20 rounded-full animate-pulse delay-500"></div>
            <div className="absolute bottom-10 right-10 w-2 h-2 bg-white/40 rounded-full animate-pulse delay-1500"></div>
            <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-white/25 rounded-full animate-pulse delay-700"></div>
            <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-white/20 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold mb-6 animate-in fade-in-50 slide-in-from-top-4">
              AI Platformaning Kuchi
            </h3>
            <p className="text-xl text-white/90 max-w-3xl mx-auto animate-in fade-in-50 slide-in-from-top-4 delay-200">
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
                icon: TrendingUp,
                title: "Shaxsiy Ta'lim Yo'li",
                description: "AI sizning ehtiyojlaringizga moslashtirilgan dastur",
                features: ["Individual yondashuv", "Adaptiv o'qitish", "Maqsadli tayyorgarlik"],
              },
              {
                icon: Zap,
                title: "Tezkor Natijalar",
                description: "Darhol tahlil va tavsiyalar olish",
                features: ["Instant feedback", "24/7 mavjudlik", "Tezkor javoblar"],
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`group animate-in fade-in-50 slide-in-from-bottom-4 delay-${(index + 1) * 200}`}
              >
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

      {/* Interactive Demo Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">AI Tizimini Sinab Ko'ring</h3>
            <p className="text-xl text-gray-600">Interaktiv demo orqali platformamizning imkoniyatlarini kashf eting</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Interactive Demo Card */}
            <div className="relative">
              <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 animate-pulse delay-1000"></div>

                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="bg-white/20 p-3 rounded-full mr-4 animate-bounce">
                      <Brain className="h-8 w-8" />
                    </div>
                    <div>
                      <Badge className="bg-white/20 text-white mb-2">AI Powered</Badge>
                      <h4 className="text-2xl font-bold">Test Ishlang va Darajangizni Aniqlang!</h4>
                    </div>
                  </div>

                  <p className="text-lg mb-6 text-white/90">
                    Sun'iy intellekt texnologiyasi yordamida sizning bilim darajangizni aniq baholash va shaxsiy ta'lim
                    dasturini tayyorlash
                  </p>

                  <div className="space-y-4 mb-8">
                    {[
                      "25 ta maxsus darajalangan test",
                      "AI tomonidan avtomatik tahlil",
                      "Shaxsiy ta'lim yo'li tavsiyasi",
                      "Real-time natija kuzatuvi",
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center animate-in slide-in-from-left-4"
                        style={{ animationDelay: `${index * 200}ms` }}
                      >
                        <CheckCircle className="h-5 w-5 mr-3 text-green-300" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold flex-1 group">
                      <Rocket className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                      Hoziroq Boshlash
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-blue-600 group bg-transparent"
                    >
                      <Play className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Demo */}
            <div>
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>

                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="bg-white/20 p-3 rounded-full mr-4 animate-pulse">
                      <BarChart3 className="h-8 w-8" />
                    </div>
                    <div>
                      <Badge className="bg-white/20 text-white mb-2">Smart Analytics</Badge>
                      <h4 className="text-2xl font-bold">Aqlli Tahlil va Hisobotlar</h4>
                    </div>
                  </div>

                  <p className="text-lg mb-6 text-white/90">
                    Sizning o'sish dinamikangizni kuzatib boring va AI tavsiyalari asosida bilimingizni yanada
                    mustahkamlang
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/20 p-4 rounded-lg text-center transform hover:scale-105 transition-transform">
                      <PieChart className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{accuracyCount}%</div>
                      <div className="text-sm">Aniqlik</div>
                    </div>
                    <div className="bg-white/20 p-4 rounded-lg text-center transform hover:scale-105 transition-transform">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-2xl font-bold">24/7</div>
                      <div className="text-sm">Mavjudlik</div>
                    </div>
                  </div>

                  <Button className="w-full bg-white text-green-600 hover:bg-gray-100 font-semibold group">
                    <BarChart3 className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                    Hisobotni Ko'rish
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Main Sections */}
      <section id="sections" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-6 animate-in fade-in-50 slide-in-from-top-4">
              Ta'lim Bo'limlari
            </h3>
            <p className="text-xl text-gray-600 animate-in fade-in-50 slide-in-from-top-4 delay-200">
              O'zingizga mos bo'limni tanlang va AI yordamida ta'lim jarayonini boshlang
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Enhanced O'quvchi Bo'limi */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-2 hover:border-blue-200 relative overflow-hidden transform hover:scale-105 animate-in fade-in-50 slide-in-from-left-4">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-pulse">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Enhanced
                </Badge>
              </div>

              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:animate-spin"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-full group-hover:animate-bounce">
                      <Users className="h-8 w-8" />
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
                    <div
                      key={index}
                      className={`flex items-start space-x-3 animate-in slide-in-from-left-4 delay-${index * 100}`}
                    >
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
                    <ChevronUp className="h-4 w-4 ml-2 group-hover:animate-bounce" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-2 group-hover:animate-bounce" />
                  )}
                </Button>

                {expandedSection === "student" && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 animate-in slide-in-from-top-4">
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
                        <li key={index} className={`animate-in slide-in-from-left-4 delay-${index * 100}`}>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Abituriyent Bo'limi - Similar enhancements */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-2 hover:border-purple-200 relative overflow-hidden transform hover:scale-105 animate-in fade-in-50 slide-in-from-right-4">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white animate-pulse">
                  <Zap className="h-3 w-3 mr-1" />
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
                  {/* Asosiy Fan Yo'nalishi */}
                  <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Target className="h-5 w-5 mr-2 text-blue-600 animate-pulse" />
                        Asosiy Fan Yo'nalishi
                      </h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleSection("main")}
                        className="hover:scale-110 transition-transform"
                      >
                        {expandedSection === "main" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {expandedSection === "main" && (
                      <div className="space-y-3 text-sm animate-in slide-in-from-top-4">
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
                              <li key={index} className={`animate-in slide-in-from-left-4 delay-${index * 100}`}>
                                • {level}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white p-3 rounded border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                          <p className="font-medium text-purple-800 flex items-center">
                            <Lightbulb className="h-4 w-4 mr-2 animate-pulse" />
                            AI shaxsiy ta'lim yo'li:
                          </p>
                          <ul className="mt-2 space-y-1 text-purple-700">
                            {[
                              "AI zaif mavzularni aniqlash",
                              "Aqlli video darsliklar va amaliyot",
                              "90% natijaga AI yordamida erishish",
                              "AI nazorati ostida yakuniy testlar",
                            ].map((feature, index) => (
                              <li key={index} className={`animate-in slide-in-from-left-4 delay-${index * 100}`}>
                                • {feature}
                              </li>
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

                  {/* Majburiy Fan Yo'nalishi */}
                  <div className="border rounded-lg p-4 bg-gradient-to-r from-orange-50 to-red-50 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-orange-600 animate-pulse" />
                        Majburiy Fan Yo'nalishi
                      </h4>
                      <Badge variant="outline" className="text-orange-600 border-orange-600 animate-bounce">
                        AI 5-6 sinf
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      AI yordamida 5-6 sinf darsliklari asosida majburiy fanlar bo'yicha tayyorgarlik
                    </p>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all group">
                      <Target className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                      AI Majburiy Fanlar Testi
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced AI Platformaning Afzalliklari Section */}
      <section id="advantages" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-6 animate-in fade-in-50 slide-in-from-top-4">
              AI Platformaning Afzalliklari
            </h3>
            <p className="text-xl text-gray-600 animate-in fade-in-50 slide-in-from-top-4 delay-200">
              Nima uchun bizning sun'iy intellekt tizimimiz eng yaxshi tanlov?
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: "AI Daraja Baholash",
                description: "Sun'iy intellekt yordamida aniq va obyektiv baholash",
              },
              {
                icon: Lightbulb,
                title: "Aqlli Tavsiyalar",
                description: "AI sizning ehtiyojlaringizga moslashtirilgan tavsiyalar",
              },
              {
                icon: TrendingUp,
                title: "O'sish Kuzatuvi",
                description: "AI yordamida rivojlanish jarayonini kuzatish",
              },
              {
                icon: Zap,
                title: "Tezkor Javoblar",
                description: "AI darhol tahlil va javob berish imkoniyati",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 group animate-in fade-in-50 slide-in-from-bottom-4 delay-${(index + 1) * 100}`}
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

      {/* Enhanced Narxlar Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-6 animate-in fade-in-50 slide-in-from-top-4">Narxlar</h3>
            <p className="text-xl text-gray-600 animate-in fade-in-50 slide-in-from-top-4 delay-200">
              O'zingizga mos narx rejasini tanlang
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Boshlang'ich",
                price: "Bepul",
                features: ["Asosiy testlar", "Cheklangan AI tahlil", "Standart yordam"],
                buttonText: "Hoziroq Boshlash",
              },
              {
                title: "O'rta",
                price: "99,000 so'm / oy",
                features: ["Barcha testlar", "To'liq AI tahlil", "24/7 yordam", "Shaxsiy ta'lim yo'li"],
                buttonText: "O'tish",
              },
              {
                title: "Premium",
                price: "199,000 so'm / oy",
                features: ["Barcha imkoniyatlar", "Maxsus AI yordam", "O'sish kuzatuvi", "Sertifikat tayyorlovi"],
                buttonText: "O'tish",
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`hover:shadow-xl transition-all duration-300 transform hover:scale-105 group animate-in fade-in-50 slide-in-from-bottom-4 delay-${(index + 1) * 100}`}
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold mb-4">{plan.title}</CardTitle>
                  <CardDescription className="text-gray-600">{plan.price}</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 transition-all">
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Bog'lanish Section */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-6 animate-in fade-in-50 slide-in-from-top-4">
              Bog'lanish
            </h3>
            <p className="text-xl text-gray-600 animate-in fade-in-50 slide-in-from-top-4 delay-200">
              Savollaringiz bormi? Biz bilan bog'laning
            </p>
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
                  <Smartphone className="h-6 w-6 text-green-600" />
                  <span>+998 (90) 123-45-67</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-purple-600" />
                  <span>24/7 AI yordam xizmati</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-2xl font-bold mb-4">So'rov Yuborish</h4>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                    Ismingiz
                  </label>
                  <Input type="text" id="name" placeholder="Ismingizni kiriting" className="w-full" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <Input type="email" id="email" placeholder="Emailingizni kiriting" className="w-full" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                    Xabar
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Xabaringizni kiriting"
                  ></textarea>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 transition-all">
                  <Send className="h-4 w-4 mr-2" />
                  Yuborish
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-32 right-1/3 w-8 h-8 border border-white/20 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* Newsletter Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-16 text-center">
            <h3 className="text-3xl font-bold mb-4">Yangiliklar va AI Maslahatlar</h3>
            <p className="text-lg mb-6 text-blue-100">
              Eng so'nggi AI ta'lim yangiliklari va maxsus takliflardan xabardor bo'ling
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email manzilingizni kiriting"
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                required
              />
              <Button type="submit" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                <Send className="h-4 w-4 mr-2" />
                Obuna bo'lish
              </Button>
            </form>
          </div>

          {/* Main Footer Content */}
          <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-8 mb-12">
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

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span>Toshkent, O'zbekiston</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="h-5 w-5 text-green-400" />
                  <span>+998 (90) 123-45-67</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="h-5 w-5 text-purple-400" />
                  <span>info@talimtizimi.uz</span>
                </div>
              </div>
            </div>

            {/* AI Bo'limlar */}
            <div>
              <h4 className="text-lg font-bold mb-6 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-400" />
                AI Bo'limlar
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "AI O'quvchi bo'limi", icon: Users },
                  { name: "AI Abituriyent bo'limi", icon: GraduationCap },
                  { name: "AI Daraja aniqlash", icon: Target },
                  { name: "AI Tahlil va hisobotlar", icon: BarChart3 },
                  { name: "AI Shaxsiy mentor", icon: Brain },
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
                    >
                      <item.icon className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      <span>{item.name}</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Xizmatlar */}
            <div>
              <h4 className="text-lg font-bold mb-6 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-green-400" />
                Xizmatlar
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Video darsliklar", icon: PlayCircle },
                  { name: "Interaktiv testlar", icon: CheckCircle },
                  { name: "Mobil ilovalar", icon: Smartphone },
                  { name: "24/7 AI yordam", icon: MessageCircle },
                  { name: "Sertifikatlar", icon: Award },
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
                    >
                      <item.icon className="h-4 w-4 text-gray-400 group-hover:text-green-400 transition-colors" />
                      <span>{item.name}</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Yordam */}
            <div>
              <h4 className="text-lg font-bold mb-6 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-purple-400" />
                Yordam
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "AI Qo'llanma", icon: FileText },
                  { name: "FAQ", icon: HelpCircle },
                  { name: "Texnik yordam", icon: Settings },
                  { name: "Bog'lanish", icon: MessageCircle },
                  { name: "Maxfiylik siyosati", icon: Shield },
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
                    >
                      <item.icon className="h-4 w-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                      <span>{item.name}</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Media & Stats */}
          <div className="border-t border-gray-700 pt-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Social Media */}
              <div>
                <h4 className="text-lg font-bold mb-4">Ijtimoiy tarmoqlar</h4>
                <div className="flex space-x-4">
                  {[
                    { icon: Facebook, color: "hover:text-blue-500", bg: "hover:bg-blue-500/20" },
                    { icon: Instagram, color: "hover:text-pink-500", bg: "hover:bg-pink-500/20" },
                    { icon: Youtube, color: "hover:text-red-500", bg: "hover:bg-red-500/20" },
                    { icon: Linkedin, color: "hover:text-blue-600", bg: "hover:bg-blue-600/20" },
                    { icon: Twitter, color: "hover:text-blue-400", bg: "hover:bg-blue-400/20" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`p-3 rounded-full bg-gray-800 text-gray-400 ${social.color} ${social.bg} transition-all duration-300 transform hover:scale-110`}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Live Stats */}
              <div className="text-right">
                <h4 className="text-lg font-bold mb-4">Jonli statistika</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{studentCount.toLocaleString()}+</div>
                    <div className="text-xs text-gray-400">O'quvchilar</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{accuracyCount}%</div>
                    <div className="text-xs text-gray-400">AI Aniqlik</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">24/7</div>
                    <div className="text-xs text-gray-400">Yordam</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>&copy; 2024 Ta'lim Tizimi. Barcha huquqlar himoyalangan.</span>
                <div className="hidden md:flex items-center space-x-4">
                  <a href="#" className="hover:text-white transition-colors">
                    Maxfiylik
                  </a>
                  <span>•</span>
                  <a href="#" className="hover:text-white transition-colors">
                    Shartlar
                  </a>
                  <span>•</span>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Tizim faol
                </Badge>
                <div className="text-sm text-gray-400">
                  Oxirgi yangilanish: {new Date().toLocaleDateString("uz-UZ")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Back to Top Button */}
        <button
          onClick={() => scrollToSection("home")}
          className="fixed bottom-24 right-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-40"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      </footer>

      {/* AI Assistant Component */}
      <AIAssistant />
    </div>
  )
}
