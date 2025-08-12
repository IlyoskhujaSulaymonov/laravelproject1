"use client"

import { MathQuestionEditor } from "@/components/math-question-editor"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <MathQuestionEditor />
      </div>
    </div>
  )
}
