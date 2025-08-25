// Test-related TypeScript interfaces and types

export interface TestQuestion {
  id: number
  question: string
  formulas?: any[]
  images?: string[]
  variants: TestVariant[]
  topic_id: number
  created_at: string
  updated_at: string
}

export interface TestVariant {
  id: number
  question_id: number
  option_letter: string
  text: string
  formulas?: any[]
  is_correct: boolean
  created_at: string
  updated_at: string
}

export interface TestTopic {
  id: number
  title: string
  subject_id: number
  order: number
  subject?: {
    id: number
    name: string
    code: string
    description?: string
  }
  questions_count?: number
  created_at: string
  updated_at: string
}

export interface UserTestAnswer {
  question_id: number
  user_answer_id: number
  correct_answer_id: number
  is_correct: boolean
}

export interface UserTest {
  id: number
  user_id: number
  topic_id: number
  test_name: string
  total_questions: number
  correct_answers: number
  score_percentage: number
  time_spent: number
  questions_data?: UserTestAnswer[]
  status: 'in_progress' | 'completed' | 'cancelled'
  category?: TestCategory['id']
  difficulty_level?: TestDifficulty
  test_type?: TestType
  topic?: TestTopic
  grade?: string
  formatted_time_spent?: string
  created_at: string
  updated_at: string
}

export interface TestStats {
  total_tests: number
  average_score: number
  best_score: number
  total_time_spent: number
  tests_this_week?: number
  tests_this_month?: number
  improvement_rate?: number
  favorite_subjects?: Array<{
    subject: string
    test_count: number
    average_score: number
  }>
  performance_trend?: Array<{
    date: string
    score: number
  }>
}

export interface TestFilters {
  subject_id?: number
  topic_id?: number
  date_from?: string
  date_to?: string
  min_score?: number
  max_score?: number
  status?: string
  search?: string
  sort_by?: 'created_at' | 'score_percentage' | 'time_spent' | 'test_name'
  sort_direction?: 'asc' | 'desc'
}

export interface TestSession {
  id?: string
  topic_id: number
  topic: TestTopic
  questions: TestQuestion[]
  current_question_index: number
  user_answers: Record<number, number>
  start_time: Date
  time_limit?: number
  is_timed?: boolean
  status: 'not_started' | 'in_progress' | 'completed' | 'paused'
}

export interface TestConfiguration {
  questions_per_test: number
  time_limit_minutes?: number
  randomize_questions: boolean
  randomize_options: boolean
  show_correct_answers: boolean
  allow_review: boolean
  difficulty_level?: 'easy' | 'medium' | 'hard'
}

export interface TestAnalytics {
  question_id: number
  question_text: string
  total_attempts: number
  correct_attempts: number
  success_rate: number
  average_time_spent: number
  common_wrong_answers: Array<{
    option_letter: string
    option_text: string
    selection_count: number
  }>
}

export interface TestPerformance {
  user_id: number
  subject_performance: Array<{
    subject_name: string
    tests_taken: number
    average_score: number
    best_score: number
    last_test_date: string
    improvement: number
  }>
  weekly_activity: Array<{
    week: string
    tests_completed: number
    average_score: number
  }>
  skill_assessment: Array<{
    skill_name: string
    proficiency_level: number
    recommended_topics: string[]
  }>
}

export type TestDifficulty = 'easy' | 'medium' | 'hard'
export type TestStatus = 'not_started' | 'in_progress' | 'completed' | 'paused' | 'cancelled'
export type TestType = 'practice' | 'assessment' | 'quiz' | 'final_exam'

export interface TestCategory {
  id: string
  name: string
  description?: string
  color?: string
  icon?: string
}

export interface TestDifficultyLevel {
  id: TestDifficulty
  name: string
  color: string
}

export interface TestTypeDefinition {
  id: TestType
  name: string
}

export interface SharedTest {
  id: number
  test: UserTest
  shared_by: {
    id: number
    name: string
  }
  shared_with: number
  message?: string
  allow_retake: boolean
  shared_at: string
}

export interface StudyGroup {
  id: number
  name: string
  description?: string
  created_by: number
  subject_id?: number
  members: Array<{
    id: number
    name: string
    role: 'member' | 'admin' | 'owner'
  }>
  created_at: string
  updated_at: string
}

export interface LeaderboardEntry {
  rank: number
  user_id: number
  name: string
  total_tests: number
  average_score: number
  best_score: number
  total_time: number
}

export interface Leaderboard {
  leaderboard: LeaderboardEntry[]
  period: 'daily' | 'weekly' | 'monthly' | 'all_time'
  user_rank: {
    rank: number | null
    average_score: number
    total_tests: number
  }
}

// API Response Types
export interface TestAPIResponse<T> {
  success: boolean
  message?: string
  data: T
  pagination?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface GetTestsResponse {
  tests: UserTest[]
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface GetTestStatsResponse {
  stats: TestStats
  recent_tests: UserTest[]
}

export interface GetTopicsResponse {
  topics: TestTopic[]
}

export interface GetQuestionsResponse {
  topic: TestTopic
  questions: TestQuestion[]
}