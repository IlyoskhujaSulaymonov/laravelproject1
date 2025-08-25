"use client"

import React, { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import {
  BookOpen,
  Trophy,
  Target,
  Clock,
  PlayCircle,
  CheckCircle,
  X,
  RotateCcw,
  FileText,
  TrendingUp,
  Filter,
  Search,
  Calendar,
  BarChart3
} from "lucide-react"

// Import types
import type {
  UserTest,
  TestStats,
  TestTopic,
  TestQuestion,
  TestSession,
  TestFilters
} from "../types/test"

// Import visualization components
import TestVisualization from "./TestVisualization"

interface TestComponentProps {
  onTestComplete?: (result: any) => void
}

export default function TestComponent({ onTestComplete }: TestComponentProps) {
  const [userTests, setUserTests] = useState<UserTest[]>([])
  const [testsLoading, setTestsLoading] = useState(false)
  const [testStats, setTestStats] = useState<TestStats>({
    total_tests: 0,
    average_score: 0,
    best_score: 0,
    total_time_spent: 0
  })
  const [availableTopics, setAvailableTopics] = useState<TestTopic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string>('')
  const [testSession, setTestSession] = useState<TestSession | null>(null)
  const [showTestResults, setShowTestResults] = useState(false)
  const [lastTestResult, setLastTestResult] = useState<any>(null)
  const [filters, setFilters] = useState<TestFilters>({})
  const [showFilters, setShowFilters] = useState(false)

  // Fetch test data
  useEffect(() => {
    fetchUserTests()
    fetchTestStats()
    fetchAvailableTopics()
  }, [])

  const fetchUserTests = async (filterParams?: TestFilters) => {
    setTestsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterParams) {
        Object.entries(filterParams).forEach(([key, value]) => {
          if (value !== undefined && value !== '' && value !== null) {
            params.append(key, String(value))
          }
        })
      }
      
      const response = await fetch(`/api/user-tests?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setUserTests(data.data.tests)
      }
    } catch (error) {
      console.error('Error fetching user tests:', error)
    } finally {
      setTestsLoading(false)
    }
  }

  const fetchTestStats = async () => {
    try {
      const response = await fetch('/api/user-tests/stats', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setTestStats(data.data.stats)
      }
    } catch (error) {
      console.error('Error fetching test stats:', error)
    }
  }

  const fetchAvailableTopics = async () => {
    try {
      const response = await fetch('/api/user-tests/topics', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setAvailableTopics(data.data.topics)
      }
    } catch (error) {
      console.error('Error fetching topics:', error)
    }
  }

  const startTest = async (topicId: string) => {
    try {
      const response = await fetch(`/api/user-tests/topics/${topicId}/questions`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.data.questions.length > 0) {
          const session: TestSession = {
            topic_id: parseInt(topicId),
            topic: data.data.topic,
            questions: data.data.questions,
            current_question_index: 0,
            user_answers: {},
            start_time: new Date(),
            status: 'in_progress'
          }
          setTestSession(session)
        } else {
          alert('Bu mavzu uchun savollar topilmadi!')
        }
      }
    } catch (error) {
      console.error('Error starting test:', error)
      alert('Test boshlashda xatolik yuz berdi!')
    }
  }

  const submitAnswer = (questionId: number, variantId: number) => {
    if (testSession) {
      setTestSession({
        ...testSession,
        user_answers: {
          ...testSession.user_answers,
          [questionId]: variantId
        }
      })
    }
  }

  const finishTest = async () => {
    if (!testSession) return

    const endTime = new Date()
    const timeSpentSeconds = Math.floor((endTime.getTime() - testSession.start_time.getTime()) / 1000)
    
    let correctAnswers = 0
    const questionsData = testSession.questions.map(question => {
      const userAnswerId = testSession.user_answers[question.id]
      const correctVariant = question.variants.find(v => v.is_correct)
      const isCorrect = userAnswerId === correctVariant?.id
      
      if (isCorrect) correctAnswers++
      
      return {
        question_id: question.id,
        user_answer_id: userAnswerId,
        correct_answer_id: correctVariant?.id,
        is_correct: isCorrect
      }
    })

    const testData = {
      topic_id: testSession.topic_id,
      test_name: `${testSession.topic.title} - ${new Date().toLocaleDateString()}`,
      total_questions: testSession.questions.length,
      correct_answers: correctAnswers,
      time_spent: timeSpentSeconds,
      questions_data: questionsData
    }

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      
      const response = await fetch('/api/user-tests', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken || ''
        },
        credentials: 'include',
        body: JSON.stringify(testData)
      })
      
      if (response.ok) {
        const result = await response.json()
        setLastTestResult({
          ...result.data.test,
          questionsData
        })
        setShowTestResults(true)
        setTestSession(null)
        
        // Refresh test data
        await fetchUserTests()
        await fetchTestStats()
        
        if (onTestComplete) {
          onTestComplete(result.data.test)
        }
      } else {
        console.error('Error saving test:', await response.text())
        alert('Test natijasini saqlashda xatolik yuz berdi!')
      }
    } catch (error) {
      console.error('Error finishing test:', error)
      alert('Test yakunlashda xatolik yuz berdi!')
    }
  }

  const cancelTest = () => {
    setTestSession(null)
    setSelectedTopic('')
  }

  const applyFilters = (newFilters: TestFilters) => {
    setFilters(newFilters)
    fetchUserTests(newFilters)
  }

  // Render different views based on current state
  if (showTestResults && lastTestResult) {
    return (
      <TestResultsView
        result={lastTestResult}
        onClose={() => {
          setShowTestResults(false)
          setLastTestResult(null)
        }}
        onRetake={() => {
          if (selectedTopic) {
            startTest(selectedTopic)
          }
          setShowTestResults(false)
          setLastTestResult(null)
        }}
      />
    )
  }

  if (testSession) {
    return (
      <TestSessionView
        session={testSession}
        onAnswer={submitAnswer}
        onNext={() => {
          if (testSession.current_question_index < testSession.questions.length - 1) {
            setTestSession({
              ...testSession,
              current_question_index: testSession.current_question_index + 1
            })
          }
        }}
        onPrevious={() => {
          if (testSession.current_question_index > 0) {
            setTestSession({
              ...testSession,
              current_question_index: testSession.current_question_index - 1
            })
          }
        }}
        onFinish={finishTest}
        onCancel={cancelTest}
      />
    )
  }

  return (
    <TestDashboardView
      userTests={userTests}
      testsLoading={testsLoading}
      testStats={testStats}
      availableTopics={availableTopics}
      selectedTopic={selectedTopic}
      onTopicSelect={setSelectedTopic}
      onStartTest={startTest}
      filters={filters}
      showFilters={showFilters}
      onToggleFilters={() => setShowFilters(!showFilters)}
      onApplyFilters={applyFilters}
    />
  )
}

// Additional view components would be defined here...
// TestResultsView, TestSessionView, TestDashboardView components

// Placeholder implementations for view components
function TestResultsView({ result, onClose, onRetake }: any) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-2xl text-green-800 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Test yakunlandi!
          </CardTitle>
          <CardDescription className="text-green-600 text-lg">
            {result.test_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white rounded-xl border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {result.score_percentage}%
              </div>
              <div className="text-sm text-gray-600">Umumiy ball</div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white">
              Yopish
            </Button>
            <Button onClick={onRetake} variant="outline">
              Qayta urinish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TestSessionView({ session, onAnswer, onNext, onPrevious, onFinish, onCancel }: any) {
  const currentQuestion = session.questions[session.current_question_index]
  const progress = ((session.current_question_index + 1) / session.questions.length) * 100
  
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-blue-800">Test jarayoni</h2>
              <p className="text-blue-600">
                Savol {session.current_question_index + 1} / {session.questions.length}
              </p>
            </div>
            <Button onClick={onCancel} variant="outline" className="border-red-300 text-red-600">
              <X className="h-4 w-4 mr-2" />
              Chiqish
            </Button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="text-lg font-medium text-gray-800 leading-relaxed">
              <div className="flex items-start gap-3">
                <Badge className="bg-blue-600 text-white font-bold min-w-[2rem] h-8 flex items-center justify-center">
                  {session.current_question_index + 1}
                </Badge>
                <div className="flex-1">
                  {currentQuestion.question}
                </div>
              </div>
            </div>
            
            <div className="space-y-3 ml-12">
              {currentQuestion.variants.map((variant: any) => {
                const isSelected = session.user_answers[currentQuestion.id] === variant.id
                return (
                  <button
                    key={variant.id}
                    onClick={() => onAnswer(currentQuestion.id, variant.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 text-blue-800' 
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium mr-2">
                          {variant.option_letter}.
                        </span>
                        {variant.text}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button 
              onClick={onPrevious}
              disabled={session.current_question_index === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              ← Oldingi savol
            </Button>
            
            {session.current_question_index === session.questions.length - 1 ? (
              <Button 
                onClick={onFinish}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                disabled={Object.keys(session.user_answers).length !== session.questions.length}
              >
                <CheckCircle className="h-4 w-4" />
                Testni yakunlash
              </Button>
            ) : (
              <Button 
                onClick={onNext}
                disabled={session.current_question_index === session.questions.length - 1}
                className="flex items-center gap-2"
              >
                Keyingi savol →
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TestDashboardView({ 
  userTests, 
  testsLoading, 
  testStats, 
  availableTopics, 
  selectedTopic, 
  onTopicSelect, 
  onStartTest,
  filters,
  showFilters,
  onToggleFilters,
  onApplyFilters
}: any) {
  return (
    <div className="space-y-6">
      {/* Enhanced Test Visualizations */}
      <TestVisualization stats={testStats} recentTests={userTests} />

      {/* Start New Test */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800 flex items-center gap-3">
            <PlayCircle className="h-8 w-8" />
            Yangi test boshlash
          </CardTitle>
          <CardDescription className="text-blue-600">
            Mavzuni tanlang va bilimingizni sinab ko'ring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Mavzuni tanlang
              </label>
              <Select value={selectedTopic} onValueChange={onTopicSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Mavzuni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {availableTopics.map((topic: TestTopic) => (
                    <SelectItem key={topic.id} value={topic.id.toString()}>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{topic.title}</span>
                        {topic.subject && (
                          <Badge variant="outline" className="ml-2">
                            {topic.subject.name}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => selectedTopic && onStartTest(selectedTopic)}
                disabled={!selectedTopic}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Testni boshlash
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              So'nggi testlar
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={onToggleFilters} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtr
              </Button>
              <Badge className="bg-blue-100 text-blue-800">
                {userTests.length} ta test
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {testsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="w-16 h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : userTests.length > 0 ? (
            <div className="space-y-4">
              {userTests.map((test: UserTest) => (
                <div key={test.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        test.score_percentage >= 80 ? 'bg-green-100' :
                        test.score_percentage >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        <Trophy className={`h-6 w-6 ${
                          test.score_percentage >= 80 ? 'text-green-600' :
                          test.score_percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{test.test_name}</h4>
                        <p className="text-sm text-gray-600">
                          {test.topic?.title} • {new Date(test.created_at).toLocaleDateString('uz-UZ')}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500">
                            {test.correct_answers}/{test.total_questions} to'g'ri
                          </span>
                          <span className="text-xs text-gray-500">
                            {Math.floor((test.time_spent || 0) / 60)}:{((test.time_spent || 0) % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {test.score_percentage}%
                      </div>
                      <Badge className={`${
                        test.score_percentage >= 90 ? 'bg-green-500' :
                        test.score_percentage >= 80 ? 'bg-blue-500' :
                        test.score_percentage >= 70 ? 'bg-yellow-500' :
                        test.score_percentage >= 60 ? 'bg-orange-500' : 'bg-red-500'
                      } text-white`}>
                        {test.score_percentage >= 90 ? "A'lo" :
                         test.score_percentage >= 80 ? "Yaxshi" :
                         test.score_percentage >= 70 ? "Qoniqarli" :
                         test.score_percentage >= 60 ? "O'rtacha" : "Qoniqarsiz"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Hali testlar yo'q</h3>
              <p className="text-gray-500 mb-4">Birinchi testingizni boshlang va bilimingizni sinab ko'ring!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}