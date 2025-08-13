"use client"

import { QuestionViewer } from "@/components/question-viewer"

export default function QuestionViewPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <QuestionViewer />
      </div>
    </div>
  )
}
