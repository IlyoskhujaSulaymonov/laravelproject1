"use client"

import React, { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { X, ExternalLink, CheckCircle } from "lucide-react"
import Swal from "sweetalert2"

interface Plan {
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
}

interface ContactInfo {
  phone: string
  telegramUsername: string
}

interface PurchasePlanModalProps {
  isOpen: boolean
  onClose: () => void
  availablePlans: Plan[]
  plansLoading: boolean
  currentPlanSlug?: string
  onPlanSelect: (plan: Plan) => void
  selectedPlan: Plan | null
}

export default function PurchasePlanModal({
  isOpen,
  onClose,
  availablePlans,
  plansLoading,
  currentPlanSlug,
  onPlanSelect,
  selectedPlan,
}: PurchasePlanModalProps) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: "",
    telegramUsername: "",
  })
  const [showContactForm, setShowContactForm] = useState(false)

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyboard)

    return () => {
      window.removeEventListener("keydown", handleKeyboard)
    }
  }, [onClose])

  const handleSelectPlan = (plan: Plan) => {
    if (plan.slug !== currentPlanSlug) {
      onPlanSelect(plan)
    }
  }

  const handleConfirmPlanSelection = () => {
    if (selectedPlan) {
      // Show contact form instead of directly redirecting to Telegram
      setShowContactForm(true)
    }
  }

  const formatContactPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // Limit to 12 digits (998 + 9 digits)
    const limitedDigits = digits.slice(0, 12)

    // If starts with 998, format as +998 XX XXX XX XX
    if (limitedDigits.startsWith("998")) {
      const match = limitedDigits.match(/^998(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})$/)
      if (match) {
        return `+998 ${match[1]}${match[2] ? " " + match[2] : ""}${match[3] ? " " + match[3] : ""}${match[4] ? " " + match[4] : ""}`.trim()
      }
    }

    // If doesn't start with 998, add it and format
    if (limitedDigits.length > 0 && !limitedDigits.startsWith("998")) {
      const withCountryCode = "998" + limitedDigits.slice(0, 9) // Limit to 9 digits after 998
      const match = withCountryCode.match(/^998(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})$/)
      if (match) {
        return `+998 ${match[1]}${match[2] ? " " + match[2] : ""}${match[3] ? " " + match[3] : ""}${match[4] ? " " + match[4] : ""}`.trim()
      }
    }

    return value
  }

  const handleContactPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatContactPhoneNumber(e.target.value)
    setContactInfo({ ...contactInfo, phone: formatted })
  }

  const handleTelegramUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    // Remove @ if user types it
    if (value.startsWith("@")) {
      value = value.slice(1)
    }
    // Only allow alphanumeric characters and underscores
    value = value.replace(/[^a-zA-Z0-9_]/g, "")
    setContactInfo({ ...contactInfo, telegramUsername: value })
  }

  const handleSubmitContactInfo = async (planId: string) => {
    // Validate phone number format if provided
    if (contactInfo.phone && !contactInfo.phone.match(/^\+998 \d{2} \d{3} \d{2} \d{2}$/)) {
      alert("Iltimos, telefon raqamini to'g'ri formatda kiriting: +998 XX XXX XX XX")
      return
    }

    // Validate telegram username if provided
    if (contactInfo.telegramUsername && contactInfo.telegramUsername.length < 5) {
      alert("Telegram username kamida 5 ta belgidan iborat bo'lishi kerak")
      return
    }

    if (!contactInfo.phone && !contactInfo.telegramUsername) {
      alert("Iltimos, telefon raqamingiz yoki Telegram username kiriting!")
      return
    }

    try {
      // Submit contact info to backend
      await fetch("/sanctum/csrf-cookie", {
        credentials: "include",
      })

      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content")

      const response = await fetch("/api/telegram/request-plan-purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": csrfToken || "",
        },
        credentials: "include",
        body: JSON.stringify({
          plan_id: planId,
          phone: contactInfo.phone,
          telegram_username: contactInfo.telegramUsername,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // ✅ Success message with SweetAlert2
        Swal.fire({
          icon: "success",
          title: "Muvaffaqiyatli!",
          text: "So'rovingiz yuborildi. Tez orada admin siz bilan bog'lanadi.",
          confirmButtonText: "OK",
          confirmButtonColor: "#16a34a", // Tailwind green-600
          timer: 4000,
          timerProgressBar: true,
        })

        // Reset states
        onClose()
        setShowContactForm(false)
        setContactInfo({ phone: "", telegramUsername: "" })
      } else {
        // ❌ Error message
        Swal.fire({
          icon: "error",
          title: "Xatolik",
          text:
            data.message ||
            "Xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.",
          confirmButtonText: "OK",
          confirmButtonColor: "#dc2626", // Tailwind red-600
        })
      }
    } catch (error) {
      console.error("Error submitting contact info:", error)
      Swal.fire({
        icon: "error",
        title: "Xatolik yuz berdi",
        text: "Iltimos, keyinroq qayta urinib ko'ring.",
        confirmButtonText: "Yopish",
        confirmButtonColor: "#dc2626",
      })
    }
  }

  if (!isOpen) return null

  return (
    <div 
      data-plan-modal
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tarif rejasini tanlang</h2>
              <p className="text-gray-600 mt-1">O'zingizga mos keladigan rejani tanlang va admin bilan bog'laning</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-full h-10 w-10 transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-8">
          {plansLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-gray-100 rounded-2xl p-8 animate-pulse shadow-sm">
                  <div className="h-6 bg-gray-200 rounded-lg mb-6"></div>
                  <div className="h-8 bg-gray-200 rounded-lg mb-6"></div>
                  <div className="space-y-3 mb-8">
                    <div className="h-4 bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-4/5"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-3/5"></div>
                  </div>
                  <div className="h-12 bg-gray-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availablePlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`group relative border rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    selectedPlan?.id === plan.id
                      ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl ring-2 ring-blue-200"
                      : plan.slug === currentPlanSlug
                        ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg"
                        : "border-gray-200 hover:border-blue-300 bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50"
                  }`}
                  onClick={() => plan.slug !== currentPlanSlug && handleSelectPlan(plan)}
                >
                  {plan.slug === currentPlanSlug && (
                    <div className="absolute -top-3 left-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      Joriy rejangiz
                    </div>
                  )}

                  <div className="mb-2 pt-2">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 text-balance">{plan.name}</h3>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      {plan.price > 0 ? `${plan.price.toLocaleString()} so'm` : "Bepul"}
                    </div>
                    <div className="text-sm text-gray-500 font-medium px-3 py-1 bg-gray-100 rounded-full inline-block">
                      {plan.duration > 0 ? `${plan.duration} kun` : "Cheksiz muddatli"}
                    </div>
                  </div>

                  {plan.description && (
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed bg-gray-50 p-2 rounded-xl border border-gray-100">
                      {plan.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <span className="text-gray-600 font-medium">Testlar:</span>
                      <span className="font-bold text-gray-900 bg-blue-100 px-3 py-1 rounded-full text-sm">
                        {plan.assessments_limit === 999 ? "Cheksiz" : plan.assessments_limit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <span className="text-gray-600 font-medium">Darslar:</span>
                      <span className="font-bold text-gray-900 bg-purple-100 px-3 py-1 rounded-full text-sm">
                        {plan.lessons_limit === -1 ? "Cheksiz" : plan.lessons_limit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <span className="text-gray-600 font-medium">AI yordami:</span>
                      <span className="font-bold text-gray-900 bg-green-100 px-3 py-1 rounded-full text-sm">
                        {plan.ai_hints_limit === -1 ? "Cheksiz" : plan.ai_hints_limit}
                      </span>
                    </div>
                  </div>

                  {selectedPlan?.id === plan.id && plan.slug !== currentPlanSlug && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleConfirmPlanSelection()
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      Bu rejani sotib olish
                    </Button>
                  )}

                  {plan.slug === currentPlanSlug && (
                    <Button
                      disabled
                      className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-500 cursor-not-allowed font-semibold py-3 rounded-xl"
                    >
                      Joriy rejangiz
                    </Button>
                  )}

                  {!selectedPlan && plan.slug !== currentPlanSlug && (
                    <Button
                      variant="outline"
                      className="w-full border-2 border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent font-semibold py-3 rounded-xl transition-all duration-200 hover:border-blue-400 hover:shadow-md"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectPlan(plan)
                      }}
                    >
                      Tanlash
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {!plansLoading && availablePlans.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4 text-lg">Hozirda mavjud rejalar yo'q</div>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
            </div>
          )}
        </div>

        {selectedPlan && !showContactForm && (
          <div className="p-8 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">Tanlangan reja: {selectedPlan.name}</h3>
                <p className="text-gray-600">Bog'lanish ma'lumotlarini kiriting</p>
              </div>
              <Button
                onClick={handleConfirmPlanSelection}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center space-x-2 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Bog'lanish ma'lumotlarini kiritish</span>
              </Button>
            </div>
          </div>
        )}

        {showContactForm && selectedPlan && (
          <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Bog'lanish ma'lumotlari</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefon raqam <span className="text-gray-400 font-normal"></span>
                  </label>
                  <Input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={handleContactPhoneChange}
                    placeholder="+998 XX XXX XX XX"
                    className="w-full h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    maxLength={17}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telegram username <span className="text-gray-400 font-normal">(ixtiyoriy)</span>
                  </label>
                  <div className="relative">
                   <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">@</span>
                    <Input
                      type="text"
                      value={contactInfo.telegramUsername}
                      onChange={handleTelegramUsernameChange}
                      placeholder="masalan: @math_student_01"
                      className="w-full h-12 !pl-8 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                      maxLength={32}
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-blue-800 leading-relaxed">
                    <strong className="font-semibold">Eslatma:</strong> Siz bilan bog'lana olishimiz uchun haqiqiy ma'lumotlardan foydalaning. Admin
                    siz bilan qisqa muddatda bog'lanadi.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowContactForm(false)
                  setContactInfo({ phone: "", telegramUsername: "" })
                }}
                className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:border-gray-400 font-semibold transition-all duration-200"
              >
                Bekor qilish
              </Button>
              <Button
                onClick={() => handleSubmitContactInfo(selectedPlan.id)}
                className="bg-gradient-to-r text-white from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                disabled={!contactInfo.phone && !contactInfo.telegramUsername}
              >
                Yuborish
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}