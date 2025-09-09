"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ExternalLink, X } from "lucide-react"

interface ContactInfoModalProps {
  selectedPlan: any
  onClose: () => void
  onSubmit: (contactInfo: { phone: string; telegramUsername: string }) => void
}

export default function ContactInfoModal({ selectedPlan, onClose, onSubmit }: ContactInfoModalProps) {
  const [contactInfo, setContactInfo] = useState({
    phone: "",
    telegramUsername: "",
  })

  // Phone number formatting function
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
    setContactInfo({ ...contactInfo, phone: formatted })
  }

  const handleSubmit = () => {
    if (!contactInfo.phone && !contactInfo.telegramUsername) {
      alert("Iltimos, telefon raqamingiz yoki Telegram username kiriting!")
      return
    }
    onSubmit(contactInfo)
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bog'lanish ma'lumotlari</h2>
              <p className="text-gray-600 mt-1">
                Admin siz bilan tez orada bog'lanadi
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon raqam (ixtiyoriy)
              </label>
              <Input
                type="tel"
                value={contactInfo.phone}
                onChange={handlePhoneChange}
                placeholder="+998 XX XXX XX XX"
                className="w-full"
                maxLength={17}
              />
              <p className="text-xs text-gray-500 mt-1">
                Masalan: +998 90 123 45 67
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telegram username (ixtiyoriy)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
                <Input
                  type="text"
                  value={contactInfo.telegramUsername}
                  onChange={(e) => setContactInfo({...contactInfo, telegramUsername: e.target.value})}
                  placeholder="Telegram username"
                  className="w-full pl-8"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Telegram'dagi foydalanuvchi nomingiz
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                Kamida bittasini kiritishingiz kerak. Admin siz bilan tez orada bog'lanadi.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Bekor qilish
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            So'rov yuborish
          </Button>
        </div>
      </div>
    </div>
  )
}