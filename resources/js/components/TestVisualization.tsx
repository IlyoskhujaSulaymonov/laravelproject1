"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import {
  Trophy,
  Target,
  Clock,
  BookOpen,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react"

interface TestStats {
  total_tests: number
  average_score: number
  best_score: number
  total_time_spent: number
  tests_this_week?: number
  tests_this_month?: number
  improvement_rate?: number
  favorite_subjects?: Array<{
    subject_name: string
    tests_taken: number
    average_score: number
    best_score: number
    last_test_date: string
  }>
  performance_trend?: Array<{
    date: string
    score: number
  }>
}

interface TestVisualizationProps {
  stats: TestStats
  recentTests?: any[]
}

export function TestStatsCards({ stats }: { stats: TestStats }) {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{stats.total_tests}</div>
          <div className="text-gray-600">Bajarilgan testlar</div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{stats.average_score}%</div>
          <div className="text-gray-600">O'rtacha ball</div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{stats.best_score}%</div>
          <div className="text-gray-600">Eng yaxshi natija</div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {Math.floor((stats.total_time_spent || 0) / 3600)}:{Math.floor(((stats.total_time_spent || 0) % 3600) / 60).toString().padStart(2, '0')}
          </div>
          <div className="text-gray-600">Umumiy vaqt</div>
        </CardContent>
      </Card>
    </div>
  )
}

export function TestProgressChart({ stats }: { stats: TestStats }) {
  const { performance_trend = [] } = stats

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          So'nggi 30 kun natijalari
        </CardTitle>
        <CardDescription>
          Kunlik o'rtacha balllar dinamikasi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {performance_trend.length > 0 ? (
            performance_trend.slice(-7).map((day, index) => (
              <div key={day.date} className="flex items-center space-x-4">
                <div className="w-20 text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString('uz-UZ', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{Math.round(day.score)}%</span>
                  </div>
                  <Progress value={day.score} className="h-2" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Hozircha ma'lumotlar yo'q
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function SubjectPerformanceChart({ stats }: { stats: TestStats }) {
  const { favorite_subjects = [] } = stats

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-green-600" />
          Fanlar bo'yicha natijalar
        </CardTitle>
        <CardDescription>
          Har bir fan bo'yicha o'rtacha natijalar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {favorite_subjects.length > 0 ? (
            favorite_subjects.map((subject, index) => (
              <div key={subject.subject_name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: [
                          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
                          '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
                        ][index % 8]
                      }}
                    />
                    <span className="font-medium text-gray-900">{subject.subject_name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{Math.round(subject.average_score)}%</div>
                    <div className="text-xs text-gray-500">{subject.tests_taken} ta test</div>
                  </div>
                </div>
                <Progress value={subject.average_score} className="h-2" />
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Hozircha fanlar bo'yicha ma'lumotlar yo'q
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function ImprovementIndicator({ stats }: { stats: TestStats }) {
  const { improvement_rate = 0 } = stats
  const isImproving = improvement_rate > 0
  const isSignificant = Math.abs(improvement_rate) > 5

  return (
    <Card className={`border-l-4 ${
      isImproving ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${
            isImproving ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isImproving ? (
              <TrendingUp className="h-6 w-6 text-green-600" />
            ) : (
              <TrendingDown className="h-6 w-6 text-red-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold ${
              isImproving ? 'text-green-800' : 'text-red-800'
            }`}>
              {isImproving ? 'Yaxshilanish' : 'Pasayish'} ko'rsatkichi
            </h3>
            <p className="text-sm text-gray-600">
              So'nggi 10 ta test oldingi 10 tasiga nisbatan{' '}
              <span className={`font-bold ${
                isImproving ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(improvement_rate).toFixed(1)}%{' '}
                {isImproving ? 'yaxshi' : 'yomon'}
              </span>
            </p>
            {isSignificant && (
              <Badge className={`mt-2 ${
                isImproving ? 'bg-green-500' : 'bg-red-500'
              } text-white`}>
                {isImproving ? 'Yaxshi o\'sish!' : 'Diqqat talab'}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function WeeklyActivityChart({ stats }: { stats: TestStats }) {
  const { tests_this_week = 0, tests_this_month = 0 } = stats
  
  // Generate mock weekly data for visualization
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      day: date.toLocaleDateString('uz-UZ', { weekday: 'short' }),
      tests: Math.floor(Math.random() * 3), // Mock data
      date: date.toISOString().split('T')[0]
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-600" />
          Haftalik faollik
        </CardTitle>
        <CardDescription>
          Bu hafta: {tests_this_week} ta test | Bu oy: {tests_this_month} ta test
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between space-x-2 h-32">
          {weeklyData.map((day) => (
            <div key={day.date} className="flex flex-col items-center space-y-2">
              <div 
                className="bg-purple-500 rounded-t-sm w-8 flex items-end justify-center text-white text-xs font-bold"
                style={{ height: `${Math.max(day.tests * 20, 8)}px` }}
              >
                {day.tests > 0 && day.tests}
              </div>
              <span className="text-xs text-gray-600">{day.day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function TestVisualization({ stats, recentTests = [] }: TestVisualizationProps) {
  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <TestStatsCards stats={stats} />
      
      {/* Improvement Indicator */}
      <ImprovementIndicator stats={stats} />
      
      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <TestProgressChart stats={stats} />
        <SubjectPerformanceChart stats={stats} />
      </div>
      
      {/* Weekly Activity */}
      <WeeklyActivityChart stats={stats} />
    </div>
  )
}

export default TestVisualization