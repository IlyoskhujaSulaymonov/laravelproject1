"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Brain,
  GraduationCap,
  HelpCircle,
  Sparkles,
  Zap,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai" | "system"
  content: string
  timestamp: Date
  quickReplies?: string[]
}

interface QuickReply {
  text: string
  action: string
}

const quickReplies: QuickReply[] = [
  { text: "Test qanday ishlaydi?", action: "how_test_works" },
  { text: "Darajam qanday aniqlanadi?", action: "level_assessment" },
  { text: "Qaysi bo'limni tanlashim kerak?", action: "section_choice" },
  { text: "AI qanday yordam beradi?", action: "ai_help" },
  { text: "Ro'yxatdan o'tish", action: "registration" },
  { text: "Narxlar haqida", action: "pricing" },
]

const aiResponses: Record<string, { content: string; quickReplies?: string[] }> = {
  how_test_works: {
    content:
      "🤖 Bizning AI test tizimi quyidagicha ishlaydi:\n\n✅ 25 ta maxsus darajalangan savol\n✅ Har bir javobingiz AI tomonidan tahlil qilinadi\n✅ Real vaqtda daraja baholanadi\n✅ Shaxsiy ta'lim yo'li tavsiya etiladi\n\nTest taxminan 30-45 daqiqa davom etadi.",
    quickReplies: ["Testni boshlash", "Boshqa savollar", "Admin bilan bog'lanish"],
  },
  level_assessment: {
    content:
      "📊 AI daraja baholash 4 bosqichda amalga oshiriladi:\n\n🔴 1-bosqich: Past daraja (0-56%)\n🟡 2-bosqich: Qoniqarli daraja (57-75%)\n🟢 3-bosqich: Yaxshi daraja (76-88%)\n🔵 4-bosqich: A'lo daraja (89-100%)\n\nHar bir bosqich uchun maxsus ta'lim dasturi tayyorlanadi!",
    quickReplies: ["Testni boshlash", "Dastur haqida", "Boshqa savollar"],
  },
  section_choice: {
    content:
      "🎯 Bo'lim tanlash uchun quyidagi yo'riqnomadan foydalaning:\n\n👨‍🎓 **O'quvchi bo'limi** - agar siz 1-11 sinf o'quvchisi bo'lsangiz\n🎓 **Abituriyent bo'limi** - agar OTM ga tayyorlanayotgan bo'lsangiz\n\nAbituriyent bo'limida:\n• Asosiy fanlar - ixtisoslik fanlari\n• Majburiy fanlar - 5-6 sinf asosida\n\nQaysi birini tanlashni istaysiz?",
    quickReplies: ["O'quvchi bo'limi", "Abituriyent bo'limi", "Batafsil ma'lumot"],
  },
  ai_help: {
    content:
      "🧠 Bizning AI yordamchisi quyidagi xizmatlarni taqdim etadi:\n\n🔍 **Daraja aniqlash** - aniq va obyektiv baholash\n📚 **Shaxsiy dastur** - sizning ehtiyojlaringizga moslashtirilgan\n📈 **O'sish kuzatuvi** - rivojlanish jarayonini tahlil qilish\n⚡ **Tezkor javoblar** - darhol yordam va maslahat\n🎯 **Aqlli tavsiyalar** - eng samarali o'qish usullari\n\n24/7 mavjud!",
    quickReplies: ["AI testni boshlash", "Boshqa imkoniyatlar", "Demo ko'rish"],
  },
  registration: {
    content:
      "📝 Ro'yxatdan o'tish juda oson!\n\n1️⃣ Telefon raqamingizni kiriting\n2️⃣ SMS kod orqali tasdiqlang\n3️⃣ Asosiy ma'lumotlarni to'ldiring\n4️⃣ AI test bilan boshlang!\n\n🎁 Birinchi test bepul!",
    quickReplies: ["Ro'yxatdan o'tish", "Demo ko'rish", "Boshqa savollar"],
  },
  pricing: {
    content:
      "💰 Bizning narxlar juda qulay:\n\n🆓 **Bepul** - Birinchi daraja aniqlash testi\n💎 **Premium** - 50,000 so'm/oy\n• Cheksiz testlar\n• AI shaxsiy mentor\n• Video darsliklar\n• Batafsil hisobotlar\n\n🎯 **VIP** - 80,000 so'm/oy\n• Premium + individual maslahat\n• Tezkor yordam\n• Maxsus materiallar",
    quickReplies: ["Premium sotib olish", "Bepul testni boshlash", "Boshqa savollar"],
  },
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "system",
      content: "AI Yordamchi faollashtirildi! 🤖",
      timestamp: new Date(),
    },
    {
      id: "2",
      type: "ai",
      content:
        "Salom! Men sizning shaxsiy AI ta'lim yordamchingizman. 🎓\n\nMen sizga quyidagi masalalarda yordam bera olaman:\n• Test ishlash jarayoni\n• Daraja aniqlash\n• Bo'lim tanlash\n• AI imkoniyatlari\n\nQanday yordam kerak?",
      timestamp: new Date(),
      quickReplies: quickReplies.slice(0, 4).map((q) => q.text),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
      inputRef.current?.focus()
    }
  }, [isOpen])

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(
      () => {
        const aiResponse = generateAIResponse(content)
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: aiResponse.content,
          timestamp: new Date(),
          quickReplies: aiResponse.quickReplies,
        }

        setMessages((prev) => [...prev, aiMessage])
        setIsTyping(false)

        if (!isOpen) {
          setUnreadCount((prev) => prev + 1)
        }
      },
      1500 + Math.random() * 1000,
    )
  }

  const generateAIResponse = (userInput: string): { content: string; quickReplies?: string[] } => {
    const input = userInput.toLowerCase()

    // Check for quick reply actions
    const quickReply = quickReplies.find(
      (q) => input.includes(q.text.toLowerCase()) || input.includes(q.action.replace("_", " ")),
    )

    if (quickReply && aiResponses[quickReply.action]) {
      return aiResponses[quickReply.action]
    }

    // Keyword-based responses
    if (input.includes("test") || input.includes("тест")) {
      return aiResponses.how_test_works
    }

    if (input.includes("daraja") || input.includes("даража") || input.includes("level")) {
      return aiResponses.level_assessment
    }

    if (input.includes("bo'lim") || input.includes("бўлим") || input.includes("section")) {
      return aiResponses.section_choice
    }

    if (input.includes("ai") || input.includes("ай") || input.includes("intellekt")) {
      return aiResponses.ai_help
    }

    if (input.includes("ro'yxat") || input.includes("рўйхат") || input.includes("register")) {
      return aiResponses.registration
    }

    if (input.includes("narx") || input.includes("нарх") || input.includes("price") || input.includes("cost")) {
      return aiResponses.pricing
    }

    // Default response
    return {
      content:
        "🤔 Kechirasiz, bu savolingizni to'liq tushunmadim. \n\nQuyidagi mavzular bo'yicha yordam bera olaman:\n• Test ishlash jarayoni\n• Daraja aniqlash tizimi\n• Bo'limlar haqida ma'lumot\n• AI imkoniyatlari\n• Ro'yxatdan o'tish\n• Narxlar\n\nYoki admin bilan bog'lanishingiz mumkin - 24 soat ichida javob beramiz! 📞",
      quickReplies: ["Admin bilan bog'lanish", "Testni boshlash", "Boshqa savollar"],
    }
  }

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300 group relative"
          >
            <div className="absolute -top-2 -right-2">
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs px-2 py-1 animate-pulse">{unreadCount}</Badge>
              )}
            </div>
            <div className="relative">
              <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </Button>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
              AI Yordamchi bilan suhbat
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card
            className={`w-96 shadow-2xl border-2 border-blue-200 transition-all duration-300 ${
              isMinimized ? "h-16" : "h-[600px]"
            }`}
          >
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Brain className="h-5 w-5" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <CardTitle className="text-lg">AI Yordamchi</CardTitle>
                    <p className="text-xs text-blue-100">{isTyping ? "Yozmoqda..." : "Onlayn • Darhol javob beradi"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-white hover:bg-white/20 p-1"
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {!isMinimized && (
              <CardContent className="p-0 flex flex-col h-[536px]">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <div key={message.id}>
                      {message.type === "system" && (
                        <div className="text-center">
                          <Badge variant="outline" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            {message.content}
                          </Badge>
                        </div>
                      )}

                      {message.type === "ai" && (
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="bg-white rounded-2xl rounded-tl-md p-3 shadow-sm border">
                              <p className="text-sm text-gray-800 whitespace-pre-line">{message.content}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 ml-2">
                              AI Yordamchi • {formatTime(message.timestamp)}
                            </p>

                            {/* Quick Replies */}
                            {message.quickReplies && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {message.quickReplies.map((reply, index) => (
                                  <Button
                                    key={index}
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleQuickReply(reply)}
                                    className="text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                                  >
                                    {reply}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {message.type === "user" && (
                        <div className="flex items-start space-x-3 justify-end">
                          <div className="flex-1">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-md p-3 shadow-sm ml-12">
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 mr-2 text-right">
                              Siz • {formatTime(message.timestamp)}
                            </p>
                          </div>
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-md p-3 shadow-sm border">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                <div className="p-3 bg-white border-t">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickReply("Test qanday ishlaydi?")}
                      className="text-xs flex items-center"
                    >
                      <HelpCircle className="h-3 w-3 mr-1" />
                      Test haqida
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickReply("AI qanday yordam beradi?")}
                      className="text-xs flex items-center"
                    >
                      <Brain className="h-3 w-3 mr-1" />
                      AI yordam
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickReply("Ro'yxatdan o'tish")}
                      className="text-xs flex items-center"
                    >
                      <GraduationCap className="h-3 w-3 mr-1" />
                      Boshlash
                    </Button>
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t">
                  <div className="flex items-center space-x-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                      placeholder="Savolingizni yozing..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full p-2"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    <Zap className="h-3 w-3 inline mr-1" />
                    AI yordamchi 24/7 sizning xizmatingizdа
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </>
  )
}
