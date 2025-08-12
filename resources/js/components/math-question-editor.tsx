"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MathRenderer } from "@/components/math-renderer"
import { Edit, Trash2, ImageIcon, Plus, Calculator } from "lucide-react"
import { MathPopup } from "@/components/math-popup" // Added missing MathPopup component import

interface MathFormula {
  id: string
  latex: string
  position?: number
}

interface UploadedImage {
  id: string
  url: string
  name: string
  position?: number
}

interface QuestionVariant {
  id: string
  text: string
  isCorrect: boolean
  formulas: MathFormula[]
}

export function MathQuestionEditor() {
  const [currentStep, setCurrentStep] = useState(1)
  const [question, setQuestion] = useState("")
  const [showMathPopup, setShowMathPopup] = useState(false)
  const [editingFormula, setEditingFormula] = useState<MathFormula | null>(null)
  const [formulas, setFormulas] = useState<MathFormula[]>([])
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [variants, setVariants] = useState<QuestionVariant[]>([
    { id: "variant-a", text: "", isCorrect: true, formulas: [] },
    { id: "variant-b", text: "", isCorrect: false, formulas: [] },
    { id: "variant-c", text: "", isCorrect: false, formulas: [] },
    { id: "variant-d", text: "", isCorrect: false, formulas: [] },
  ])
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [editingVariantFormula, setEditingVariantFormula] = useState<{
    variantId: string
    formula: MathFormula | null
  }>({ variantId: "", formula: null })
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [cursorPosition, setCursorPosition] = useState(0)

  useEffect(() => {
    const formulaRegex = /\$\$?([^$]+)\$\$?/g
    const foundFormulas: MathFormula[] = []
    let match

    while ((match = formulaRegex.exec(question)) !== null) {
      foundFormulas.push({
        id: Math.random().toString(36).substr(2, 9),
        latex: match[1].trim(),
        position: match.index,
      })
    }
    setFormulas(foundFormulas)
  }, [question])

  useEffect(() => {
    const imageRegex = /\[IMAGE:([^\]]+)\]/g
    const foundImages: UploadedImage[] = []
    let match

    while ((match = imageRegex.exec(question)) !== null) {
      const existingImage = uploadedImages.find((img) => img.url === match[1])
      if (existingImage) {
        foundImages.push({
          ...existingImage,
          position: match.index,
        })
      }
    }
    setUploadedImages((prev) => {
      const newImages = foundImages.filter((img) => !prev.some((p) => p.id === img.id))
      return [...prev.filter((img) => foundImages.some((f) => f.id === img.id)), ...newImages]
    })
  }, [question])

  const handleInsertFormula = (latex: string) => {
    if (editingFormula) {
      const oldFormula = `$${editingFormula.latex}$`
      const newFormula = `$${latex}$`
      const newQuestion = question.replace(oldFormula, newFormula)
      setQuestion(newQuestion)
      setEditingFormula(null)
    } else {
      const beforeCursor = question.substring(0, cursorPosition)
      const afterCursor = question.substring(cursorPosition)
      const newFormula = `$${latex}$ `
      const newQuestion = beforeCursor + newFormula + afterCursor
      setQuestion(newQuestion)

      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = cursorPosition + newFormula.length
          textareaRef.current.setSelectionRange(newPosition, newPosition)
          textareaRef.current.focus()
        }
      }, 0)
    }
    setShowMathPopup(false)
  }

  const handleEditFormula = (formula: MathFormula) => {
    setEditingFormula(formula)
    setShowMathPopup(true)
  }

  const handleDeleteFormula = (formula: MathFormula) => {
    const formulaText = `$${formula.latex}$`
    const newQuestion = question.replace(formulaText, "")
    setQuestion(newQuestion)
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value)
    setCursorPosition(e.target.selectionStart)
  }

  const handleTextareaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    setCursorPosition((e.target as HTMLTextAreaElement).selectionStart)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      const imageId = Math.random().toString(36).substr(2, 9)

      const newImage: UploadedImage = {
        id: imageId,
        url: imageUrl,
        name: file.name,
        position: cursorPosition,
      }

      setUploadedImages((prev) => [...prev, newImage])

      const beforeCursor = question.substring(0, cursorPosition)
      const afterCursor = question.substring(cursorPosition)
      const imagePlaceholder = `[IMAGE:${imageUrl}]`
      const newQuestion = beforeCursor + imagePlaceholder + afterCursor
      setQuestion(newQuestion)

      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = cursorPosition + imagePlaceholder.length
          textareaRef.current.setSelectionRange(newPosition, newPosition)
          textareaRef.current.focus()
        }
      }, 0)
    }
  }

  const deleteImage = (imageId: string) => {
    const image = uploadedImages.find((img) => img.id === imageId)
    if (image) {
      const imagePlaceholder = `[IMAGE:${image.url}]`
      const newQuestion = question.replace(imagePlaceholder, "")
      setQuestion(newQuestion)
      setUploadedImages((prev) => prev.filter((img) => img.id !== imageId))
      URL.revokeObjectURL(image.url)
    }
  }

  const renderQuestionContent = (content: string) => {
    const parts = content.split(/(\[IMAGE:[^\]]+\]|\$\$?[^$]+\$\$?)/g)

    return (
      <div className="inline-block w-full">
        {parts.map((part, index) => {
          if (part.startsWith("[IMAGE:") && part.endsWith("]")) {
            const imageUrl = part.slice(7, -1)
            return (
              <div key={index} className="my-4 flex justify-center">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Uploaded content"
                  className="max-w-full max-h-64 rounded-lg border shadow-sm"
                />
              </div>
            )
          } else if (part.includes("$")) {
            return (
              <span key={index} className="inline-block">
                <MathRenderer latex={part} />
              </span>
            )
          } else {
            return (
              <span key={index} className="inline">
                {part}
              </span>
            )
          }
        })}
      </div>
    )
  }

  const addVariantFormula = (variantId: string, latex: string) => {
    const newFormula: MathFormula = {
      id: Math.random().toString(36).substr(2, 9),
      latex,
    }
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId ? { ...variant, formulas: [...variant.formulas, newFormula] } : variant,
      ),
    )
  }

  const updateVariantFormula = (variantId: string, formulaId: string, latex: string) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              formulas: variant.formulas.map((formula) => (formula.id === formulaId ? { ...formula, latex } : formula)),
            }
          : variant,
      ),
    )
  }

  const deleteVariantFormula = (variantId: string, formulaId: string) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId
          ? { ...variant, formulas: variant.formulas.filter((formula) => formula.id !== formulaId) }
          : variant,
      ),
    )
  }

  const openVariantMathPopup = (variantId: string, formula?: MathFormula) => {
    setEditingVariantFormula({ variantId, formula: formula || null })
    setShowMathPopup(true)
  }

  const handleVariantFormulaInsert = (latex: string) => {
    if (editingVariantFormula.variantId) {
      if (editingVariantFormula.formula) {
        updateVariantFormula(editingVariantFormula.variantId, editingVariantFormula.formula.id, latex)
      } else {
        addVariantFormula(editingVariantFormula.variantId, latex)
      }
    }
    setEditingVariantFormula({ variantId: "", formula: null })
    setShowMathPopup(false)
  }

  const updateVariantText = (id: string, text: string) => {
    setVariants((prev) => prev.map((variant) => (variant.id === id ? { ...variant, text } : variant)))
  }

  const toggleCorrectVariant = (id: string) => {
    setVariants((prev) =>
      prev.map((variant) => ({
        ...variant,
        isCorrect: variant.id === id, // Only the selected variant is correct, all others are false
      })),
    )
  }

  const addVariant = () => {
    const newVariantLetter = String.fromCharCode(65 + variants.length)
    const newVariant: QuestionVariant = {
      id: `variant-${newVariantLetter.toLowerCase()}`,
      text: "",
      isCorrect: false,
      formulas: [],
    }
    setVariants([...variants, newVariant])
  }

  const removeVariant = (variantId: string) => {
    if (variants.length <= 2) return // Keep minimum 2 variants
    setVariants(variants.filter((variant) => variant.id !== variantId))
  }

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return question.trim().length > 0
      case 2:
        return variants.some((v) => v.isCorrect) && variants.some((v) => v.text.trim().length > 0)
      default:
        return true
    }
  }

  const handleSaveQuestion = async () => {
    if (!question.trim()) {
      setSaveMessage("Iltimos, savol matnini kiriting!")
      return
    }

    if (variants.length > 0 && !variants.some((v) => v.isCorrect)) {
      setSaveMessage("Iltimos, to'g'ri javobni belgilang!")
      return
    }

    setIsSaving(true)
    setSaveMessage("")

    try {
      const formData = new FormData()
      formData.append("question", question)
      formData.append("formulas", JSON.stringify(formulas))
      formData.append("variants", JSON.stringify(variants))

      for (let i = 0; i < uploadedImages.length; i++) {
        const image = uploadedImages[i]
        try {
          const response = await fetch(image.url)
          const blob = await response.blob()
          const file = new File([blob], image.name, { type: blob.type })
          formData.append(`images[${i}]`, file)
        } catch (error) {
          console.error("Error converting image:", error)
        }
      }

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
      if (csrfToken) {
        formData.append("_token", csrfToken)
      }

     const response = await fetch(route('admin.questions.store'), {
        method: "POST",
        body: formData,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      const result = await response.json()

      if (result.success) {
        setSaveMessage(result.message)
        setQuestion("")
        setFormulas([])
        setUploadedImages([])
        setVariants([
          { id: "variant-a", text: "", isCorrect: true, formulas: [] },
          { id: "variant-b", text: "", isCorrect: false, formulas: [] },
          { id: "variant-c", text: "", isCorrect: false, formulas: [] },
          { id: "variant-d", text: "", isCorrect: false, formulas: [] },
        ])
        uploadedImages.forEach((image) => {
          URL.revokeObjectURL(image.url)
        })

        setTimeout(() => {
          window.location.href = result.redirect || "/questions"
        }, 2000)
      } else {
        setSaveMessage(result.message)
      }
    } catch (error) {
      console.error("Error saving question:", error)
      setSaveMessage("Savolni saqlashda xatolik yuz berdi!")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Savol yaratish</h1>
        <div className="flex items-center space-x-4">
          {[1, 2].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === currentStep
                    ? "bg-blue-600 text-white"
                    : step < currentStep
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {step < currentStep ? "✓" : step}
              </div>
              {step < 2 && <div className="w-8 h-0.5 bg-gray-300 mx-2" />}
            </div>
          ))}
        </div>
      </div>

      {currentStep === 1 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <h2 className="text-xl font-semibold text-blue-800">1-qadam: Savol matnini kiriting</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question" className="text-sm font-medium text-blue-700">
                Savol matni
              </Label>
              <Textarea
                id="question"
                ref={textareaRef}
                value={question}
                onChange={handleTextareaChange}
                onSelect={(e) => setCursorPosition((e.target as HTMLTextAreaElement).selectionStart)}
                placeholder="Savolingizni kiriting..."
                className="mt-1 min-h-[120px] bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingFormula(null)
                  setShowMathPopup(true)
                }}
                className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 border-blue-600 hover:border-blue-700"
              >
                <Calculator className="h-4 w-4" />
                Matematik formula kiritish
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("image-upload")?.click()}
                className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 border-green-600 hover:border-green-700"
              >
                <ImageIcon className="h-4 w-4" />
                Rasm yuklash
              </Button>
              <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>

            {formulas.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-blue-700">Qo'shilgan formulalar:</h3>
                <div className="flex flex-wrap gap-2">
                  {formulas.map((formula) => (
                    <div
                      key={formula.id}
                      className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200"
                    >
                      <MathRenderer latex={formula.latex} />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditFormula(formula)}
                        className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
                        title="Tahrirlash"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteFormula(formula)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        title="O'chirish"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadedImages.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Qo'shilgan rasmlar:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteImage(image.id)}
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Rasmni o'chirish"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(question.trim() || formulas.length > 0 || uploadedImages.length > 0) && (
              <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Savol ko'rinishi:</h3>
                <div className="prose max-w-none">{renderQuestionContent(question)}</div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-indigo-800">2-qadam: Javob variantlari</h2>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVariant}
                  className="flex items-center gap-2 bg-white hover:bg-indigo-50 border-indigo-300 text-indigo-700 font-medium shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Variant qo'shish
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {(question.trim() || formulas.length > 0 || uploadedImages.length > 0) && (
              <div className="p-6 bg-white rounded-xl border-2 border-indigo-100 shadow-sm mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  Savol:
                </h3>
                <div className="prose max-w-none text-gray-700">{renderQuestionContent(question)}</div>
              </div>
            )}

            {variants.map((variant, index) => (
              <div
                key={variant.id}
                className="p-6 bg-white rounded-xl border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <div className="flex-1">
                    <Textarea
                      value={variant.text}
                      onChange={(e) => updateVariantText(variant.id, e.target.value)}
                      placeholder={`${String.fromCharCode(65 + index)} variantini kiriting...`}
                      rows={2}
                      className="w-full resize-none min-h-[80px] bg-white border-2 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      size="sm"
                      variant={variant.isCorrect ? "default" : "outline"}
                      onClick={() => toggleCorrectVariant(variant.id)}
                      className={`h-9 px-4 text-sm font-medium rounded-lg transition-all ${
                        variant.isCorrect
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md"
                          : "hover:bg-green-50 hover:border-green-300 border-2 text-green-700"
                      }`}
                      title={variant.isCorrect ? "✓ To'g'ri" : "To'g'ri?"}
                    >
                      {variant.isCorrect ? "✓ To'g'ri" : "To'g'ri?"}
                    </Button>
                    {variants.length > 2 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeVariant(variant.id)}
                        className="h-9 w-9 p-0 text-red-600 hover:text-white hover:bg-red-500 border-2 border-red-200 hover:border-red-500 rounded-lg transition-all"
                        title="Variantni o'chirish"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      Matematik formulalar:
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openVariantMathPopup(variant.id)}
                      className="h-8 px-3 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 text-blue-700 font-medium rounded-lg"
                    >
                      + Formula
                    </Button>
                  </div>

                  {variant.formulas.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {variant.formulas.map((formula) => (
                        <div
                          key={formula.id}
                          className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-100 hover:border-blue-200 transition-colors"
                        >
                          <MathRenderer latex={formula.latex} />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openVariantMathPopup(variant.id, formula)}
                            className="h-7 w-7 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-md"
                            title="Tahrirlash"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteVariantFormula(variant.id, formula.id)}
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-md"
                            title="O'chirish"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {(variant.text.trim() || variant.formulas.length > 0) && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border-2 border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                      Ko'rinishi:
                    </h4>
                    <div className="prose max-w-none text-sm text-gray-800">
                      {variant.text && <span className="inline-block">{variant.text}</span>}
                      {variant.formulas.map((formula) => (
                        <span key={formula.id} className="inline-block">
                          <MathRenderer latex={formula.latex} />
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <p className="text-sm text-gray-500">Kamida bitta variantni to'g'ri javob sifatida belgilang.</p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2 bg-transparent"
        >
          Orqaga
        </Button>

        <div className="flex gap-3">
          {currentStep < 2 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={!canProceedToNextStep()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Keyingi
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSaveQuestion}
              disabled={isSaving || !canProceedToNextStep()}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              {isSaving ? "Saqlanmoqda..." : "Savolni saqlash"}
            </Button>
          )}
        </div>
      </div>

      {saveMessage && (
        <div
          className={`p-4 rounded-lg ${
            saveMessage.includes("muvaffaqiyatli") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {saveMessage}
        </div>
      )}

      <MathPopup
        isOpen={showMathPopup}
        onClose={() => {
          setShowMathPopup(false)
          setEditingFormula(null)
          setEditingVariantFormula({ variantId: "", formula: null })
        }}
        onInsert={editingVariantFormula.variantId ? handleVariantFormulaInsert : handleInsertFormula}
        initialValue={editingFormula?.latex || editingVariantFormula.formula?.latex || ""}
      />
    </div>
  )
}
