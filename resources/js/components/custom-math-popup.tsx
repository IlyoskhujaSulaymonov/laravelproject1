"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MathRenderer } from "@/components/math-renderer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { initCustomMathModule, MathUtils } from "@/lib/math-module"

// Declare custom element types
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "custom-math-field": {
        ref?: any
        placeholder?: string
        disabled?: boolean
        style?: React.CSSProperties
        onInput?: (e: any) => void
      }
    }
  }
}

interface CustomMathPopupProps {
  isOpen: boolean
  onClose: () => void
  onInsert: (latex: string) => void
  initialValue?: string
  isEditing?: boolean
}

export function CustomMathPopup({
  isOpen,
  onClose,
  onInsert,
  initialValue = "",
  isEditing = false,
}: CustomMathPopupProps) {
  const [latex, setLatex] = useState(initialValue)
  const mathFieldRef = useRef<any>(null)
  const [isModuleLoaded, setIsModuleLoaded] = useState(false)
  const [validation, setValidation] = useState<{ valid: boolean; error?: string }>({ valid: true })
  const [selectedCategory, setSelectedCategory] = useState<string>("Basic Algebra")

  // Load custom math module
  useEffect(() => {
    const loadModule = async () => {
      const success = await initCustomMathModule()
      setIsModuleLoaded(success)
    }
    loadModule()
  }, [])

  // Set initial value when dialog opens
  useEffect(() => {
    if (isOpen && mathFieldRef.current && isModuleLoaded) {
      setTimeout(() => {
        if (mathFieldRef.current) {
          mathFieldRef.current.setValue(initialValue)
          setLatex(initialValue)
          validateLatex(initialValue)
        }
      }, 100)
    }
  }, [isOpen, initialValue, isModuleLoaded])

  const validateLatex = (value: string) => {
    const result = MathUtils.validateLatex(value)
    setValidation(result)
  }

  const handleMathFieldInput = (e: any) => {
    if (mathFieldRef.current) {
      const newLatex = mathFieldRef.current.getValue("latex")
      setLatex(newLatex)
      validateLatex(newLatex)
    }
  }

  const handleInsert = () => {
    if (latex.trim() && validation.valid) {
      onInsert(latex.trim())
      setLatex("")
      if (mathFieldRef.current) {
        mathFieldRef.current.clear()
      }
    }
  }

  const handleTemplateClick = (template: string) => {
    setLatex(template)
    if (mathFieldRef.current) {
      mathFieldRef.current.setValue(template)
    }
    validateLatex(template)
  }

  const handleClose = () => {
    setLatex("")
    if (mathFieldRef.current) {
      mathFieldRef.current.clear()
    }
    setValidation({ valid: true })
    onClose()
  }

  const templateCategories = MathUtils.getTemplatesByCategory()

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? "Formulani tahrirlash" : "Matematik formula kiritish"}
            <span className="text-sm font-normal text-blue-600 ml-2">(Enhanced Math Module)</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="editor" className="w-full h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Enhanced Editor</TabsTrigger>
            <TabsTrigger value="templates">Formula Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4 h-full">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Matematik formula (Enhanced with 100+ symbols):</Label>
              {isModuleLoaded ? (
                <div className="border rounded-lg p-2 bg-white">
                  <custom-math-field
                    ref={mathFieldRef}
                    onInput={handleMathFieldInput}
                    placeholder="LaTeX formulani kiriting yoki tugmalardan foydalaning..."
                    style={{
                      width: "100%",
                      minHeight: "300px",
                    }}
                  />
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-gray-100 text-center text-gray-500">
                  Enhanced Math Module yuklanmoqda...
                </div>
              )}

              {!validation.valid && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">
                    <strong>Xato:</strong> {validation.error}
                  </p>
                </div>
              )}

              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  <strong>Klaviatura yorliqlari:</strong>
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Ctrl+2: x² qo'shish</li>
                      <li>Ctrl+3: x³ qo'shish</li>
                      <li>Ctrl+R: √ qo'shish</li>
                      <li>Ctrl+F: Kasr qo'shish</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Ctrl+I: ∫ qo'shish</li>
                      <li>Ctrl+S: ∑ qo'shish</li>
                      <li>Ctrl+P: π qo'shish</li>
                      <li>Ctrl+A: α qo'shish</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {latex && validation.valid && (
              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <Label className="text-sm font-medium text-blue-800 mb-2 block">Ko'rinishi:</Label>
                <div className="bg-white p-3 rounded border">
                  <MathRenderer latex={latex} />
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  <strong>LaTeX:</strong> <code className="bg-gray-100 px-1 rounded">{latex}</code>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-4 h-full">
            <div className="flex gap-4 h-full">
              {/* Category Sidebar */}
              <div className="w-48 border-r pr-4">
                <Label className="text-sm font-medium mb-2 block">Kategoriyalar:</Label>
                <ScrollArea className="h-96">
                  <div className="space-y-1">
                    {Object.keys(templateCategories).map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="w-full justify-start text-xs"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Templates */}
              <div className="flex-1">
                <Label className="text-sm font-medium mb-2 block">{selectedCategory} formulalari:</Label>
                <ScrollArea className="h-96">
                  <div className="grid gap-3">
                    {templateCategories[selectedCategory]?.map((templateKey) => {
                      const template = MathUtils.templates[templateKey as keyof typeof MathUtils.templates]
                      return (
                        <Button
                          key={templateKey}
                          variant="outline"
                          onClick={() => handleTemplateClick(template)}
                          className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-blue-50 hover:border-blue-300"
                        >
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {templateKey.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <div className="bg-white p-2 rounded border w-full">
                            <MathRenderer latex={template} />
                          </div>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded w-full text-left">{template}</code>
                        </Button>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {latex && validation.valid && (
              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <Label className="text-sm font-medium text-blue-800 mb-2 block">Tanlangan formula:</Label>
                <div className="bg-white p-3 rounded border">
                  <MathRenderer latex={latex} />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Bekor qilish
          </Button>
          <Button
            onClick={handleInsert}
            disabled={!latex.trim() || !validation.valid}
            className="bg-green-600 hover:bg-green-700"
          >
            {isEditing ? "Yangilash" : "Kiritish"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
