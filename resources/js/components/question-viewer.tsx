"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle } from "lucide-react"

interface Variant {
  id: number
  text: string
  is_correct: boolean
  formulas: Array<{
    id: string
    latex: string
    position: { x: number; y: number }
  }>
}

interface Question {
  id: number
  text: string
  type: string
  difficulty: string
  formulas: Array<{
    id: string
    latex: string
    position: { x: number; y: number }
  }>
  variants: Variant[]
  images: Array<{
    id: string
    url: string
    position: { x: number; y: number }
  }>
}

declare global {
  interface Window {
    question: Question
    topic: {
      id: number
      title: string
    }
    MathJax?: any
  }
}

export function QuestionViewer() {
  const [question, setQuestion] = React.useState<Question | null>(null)
  const [topic, setTopic] = React.useState<any>(null)

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.question) {
      setQuestion(window.question)
      setTopic(window.topic)
      console.log("Question data:", window.question)
    }
  }, [])

  React.useEffect(() => {
    if (question && typeof window !== "undefined" && window.MathJax) {
      // Process MathJax after content is rendered
      setTimeout(() => {
        window.MathJax.typesetPromise?.().catch((err: any) => console.log(err))
      }, 100)
    }
  }, [question])

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Savol yuklanmoqda...</div>
      </div>
    )
  }

  const renderMathContent = (text: string, formulas: any[] = []) => {
    if (!text || typeof text !== "string") {
      return { __html: "" }
    }

    let content = text
    // Ensure formulas is an array before using forEach
    const safeFormulas = Array.isArray(formulas) ? formulas : []
    safeFormulas.forEach((formula) => {
      // Keep LaTeX syntax for MathJax to process
      content = content.replace(`[formula-${formula.id}]`, formula.latex)
    })
    return { __html: content }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Question Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Savol #{question.id}</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">{question.type}</Badge>
              <Badge variant="secondary">{question.difficulty}</Badge>
            </div>
          </div>
          {topic && <p className="text-muted-foreground">Mavzu: {topic.title}</p>}
        </CardHeader>
      </Card>

      {/* Question Content */}
      <Card>
        <CardHeader>
          <CardTitle>Savol matni</CardTitle>
        </CardHeader>
        <CardContent>
          {question.question ? (
            <div
              className="prose max-w-none text-base leading-relaxed"
              dangerouslySetInnerHTML={renderMathContent(question.question, question.formulas || [])}
            />
          ) : (
            <div className="text-muted-foreground italic">Savol matni mavjud emas</div>
          )}

          {/* Question Images */}
          {Array.isArray(question.images) && question.images.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Rasmlar:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {question.images.map((image) => (
                  <div key={image.id} className="border rounded-lg overflow-hidden">
                    <img src={image.url || "/placeholder.svg"} alt="Savol rasmi" className="w-full h-32 object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Javob variantlari</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.isArray(question.variants) &&
              question.variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className={`p-4 rounded-lg border-2 ${
                    variant.is_correct ? "border-green-500 bg-green-50" : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {variant.is_correct ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                      <span className="font-medium text-lg">{String.fromCharCode(65 + index)}.</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={renderMathContent(variant.text, variant.formulas || [])}
                      />

                      {Boolean(variant.is_correct) && (
                        <Badge className="mt-2 bg-green-600">To'g'ri javob</Badge>
                        )}

                    </div>
                  </div>
                </div>
              ))}

            {(!Array.isArray(question.variants) || question.variants.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">Hech qanday variant topilmadi</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
