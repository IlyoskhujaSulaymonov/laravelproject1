"use client"

import { MathQuestionEditor } from "@/components/math-question-editor"

export default function QuestionEditPage() {
  // Get question ID from Laravel
  const questionId = typeof window !== "undefined" ? (window as any).questionId : null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <MathQuestionEditor mode="edit" questionId={questionId} />
      </div>
    </div>
  )
}
