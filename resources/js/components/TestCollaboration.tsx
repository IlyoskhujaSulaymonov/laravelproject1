"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import {
  Users,
  Share2,
  Trophy,
  Crown,
  Medal,
  Star,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Target
} from "lucide-react"

import type { SharedTest, StudyGroup, LeaderboardEntry, Leaderboard } from "../types/test"

interface CollaborationProps {
  onBack?: () => void
}

export default function TestCollaboration({ onBack }: CollaborationProps) {
  const [activeTab, setActiveTab] = useState<'shared' | 'groups' | 'leaderboard'>('shared')
  const [sharedTests, setSharedTests] = useState<SharedTest[]>([])
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([])
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'shared') {
      fetchSharedTests()
    } else if (activeTab === 'groups') {
      fetchStudyGroups()
    } else if (activeTab === 'leaderboard') {
      fetchLeaderboard()
    }
  }, [activeTab])

  const fetchSharedTests = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user-tests/shared', {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setSharedTests(data.data.shared_tests)
      }
    } catch (error) {
      console.error('Error fetching shared tests:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudyGroups = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user-tests/study-groups', {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setStudyGroups(data.data.study_groups)
      }
    } catch (error) {
      console.error('Error fetching study groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLeaderboard = async (period: string = 'monthly') => {
    setLoading(true)
    try {
      const response = await fetch(`/api/user-tests/leaderboard?period=${period}`, {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data.data)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-orange-400" />
      default:
        return <Star className="h-5 w-5 text-blue-500" />
    }
  }

  const renderSharedTests = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Men bilan baham ko'rilgan testlar</h3>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtr
        </Button>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sharedTests.length > 0 ? (
        <div className="space-y-4">
          {sharedTests.map((sharedTest) => (
            <Card key={sharedTest.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Share2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{sharedTest.test.test_name}</h4>
                      <p className="text-sm text-gray-600">
                        {sharedTest.shared_by.name} tomonidan baham ko'rilgan
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(sharedTest.shared_at).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="mb-2">
                      {sharedTest.test.score_percentage}%
                    </Badge>
                    <div className="flex space-x-2">
                      <Button size="sm">Ko'rish</Button>
                      {sharedTest.allow_retake && (
                        <Button size="sm" variant="outline">Qayta yechish</Button>
                      )}
                    </div>
                  </div>
                </div>
                {sharedTest.message && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm italic">"{sharedTest.message}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Share2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Baham ko'rilgan testlar yo'q</h3>
          <p className="text-gray-500">Hozircha siz bilan hech qanday test baham ko'rilmagan.</p>
        </div>
      )}
    </div>
  )

  const renderStudyGroups = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">O'quv guruhlari</h3>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Yangi guruh
        </Button>
      </div>
      
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : studyGroups.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {studyGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <CardDescription>{group.members?.length || 0} a'zo</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  {group.description || "Tavsif yo'q"}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {new Date(group.created_at).toLocaleDateString('uz-UZ')}
                  </div>
                  <Button size="sm" variant="outline">
                    Kirish
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">O'quv guruhlari yo'q</h3>
          <p className="text-gray-500 mb-4">Birinchi o'quv guruhingizni yarating yoki guruhga qo'shiling.</p>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Guruh yaratish
          </Button>
        </div>
      )}
    </div>
  )

  const renderLeaderboard = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Reyting jadvali</h3>
        <div className="flex space-x-2">
          <Button 
            variant={leaderboard?.period === 'weekly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => fetchLeaderboard('weekly')}
          >
            Haftalik
          </Button>
          <Button 
            variant={leaderboard?.period === 'monthly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => fetchLeaderboard('monthly')}
          >
            Oylik
          </Button>
        </div>
      </div>
      
      {leaderboard?.user_rank && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-800">Sizning o'rningiz</h4>
                <p className="text-sm text-blue-600">
                  {leaderboard.user_rank.rank ? `${leaderboard.user_rank.rank}-o'rin` : 'Reyting yo\'q'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-800">
                  {leaderboard.user_rank.average_score}%
                </div>
                <div className="text-xs text-blue-600">
                  {leaderboard.user_rank.total_tests} ta test
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {loading ? (
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-3">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="w-16 h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : leaderboard?.leaderboard.length ? (
        <div className="space-y-2">
          {leaderboard.leaderboard.map((entry) => (
            <Card 
              key={entry.user_id} 
              className={`${
                entry.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
              } hover:shadow-md transition-shadow`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      entry.rank === 1 ? 'bg-yellow-100' :
                      entry.rank === 2 ? 'bg-gray-100' :
                      entry.rank === 3 ? 'bg-orange-100' : 'bg-blue-100'
                    }`}>
                      {getRankIcon(entry.rank)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{entry.name}</h4>
                      <p className="text-sm text-gray-600">
                        {entry.total_tests} ta test • {Math.floor(entry.total_time / 60)} daqiqa
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      {entry.average_score}%
                    </div>
                    <div className="text-sm text-gray-500">
                      Eng yaxshi: {entry.best_score}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Reyting ma'lumotlari yo'q</h3>
          <p className="text-gray-500">Hozircha reyting jadvali bo'sh.</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-purple-800">Hamkorlik va baham ko'rish</h2>
              <p className="text-purple-600">
                Testlaringizni baham ko'ring, guruhlar yarating va reyting jadvalini kuzating
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <Users className="h-12 w-12 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <Button 
          variant={activeTab === 'shared' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('shared')}
          className="flex-1"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Baham ko'rilgan
        </Button>
        <Button 
          variant={activeTab === 'groups' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('groups')}
          className="flex-1"
        >
          <Users className="h-4 w-4 mr-2" />
          O'quv guruhlari
        </Button>
        <Button 
          variant={activeTab === 'leaderboard' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('leaderboard')}
          className="flex-1"
        >
          <Trophy className="h-4 w-4 mr-2" />
          Reyting
        </Button>
      </div>

      {/* Content */}
      <div className="min-h-96">
        {activeTab === 'shared' && renderSharedTests()}
        {activeTab === 'groups' && renderStudyGroups()}
        {activeTab === 'leaderboard' && renderLeaderboard()}
      </div>

      {/* Back Button */}
      {onBack && (
        <div className="flex justify-center pt-4">
          <Button onClick={onBack} variant="outline">
            Testlarga qaytish
          </Button>
        </div>
      )}
    </div>
  )
}