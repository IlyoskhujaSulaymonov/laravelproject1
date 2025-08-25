import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Progress } from '@/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { 
    BookOpen, 
    Target, 
    TrendingUp, 
    Clock, 
    Star, 
    Award,
    Brain,
    CheckCircle,
    AlertCircle,
    Play,
    BarChart3
} from 'lucide-react';

interface SkillLevel {
    subject: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    score: number;
    last_assessed: string;
    needs_reassessment: boolean;
}

interface TopicProgress {
    total_topics: number;
    completed: number;
    mastered: number;
    in_progress: number;
    average_score: number;
}

interface Recommendation {
    id: number;
    topic: {
        id: number;
        title: string;
        subject: string;
        difficulty_level: string;
        estimated_time: number;
        description: string;
    };
    reason: 'weak_area' | 'prerequisite' | 'next_level' | 'review';
    explanation: string;
    priority: number;
    progress?: {
        status: string;
        best_score: number;
        attempts: number;
    };
}

interface DashboardData {
    analytics: {
        skill_levels: SkillLevel[];
        topic_progress: Record<string, TopicProgress>;
        recent_activity: any[];
        overall_stats: {
            total_tests_taken: number;
            average_score: number;
            total_study_time: number;
            topics_mastered: number;
            subjects_active: number;
        };
    };
    recommendations: Recommendation[];
    needs_assessment: boolean;
}

const AdaptiveLearningDashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/api/learning/dashboard', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setDashboardData(data);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartAssessment = async (subjectId: number) => {
        try {
            const response = await fetch(`/api/learning/assessment/${subjectId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                // Handle assessment completion
                fetchDashboardData(); // Refresh data
            }
        } catch (error) {
            console.error('Assessment failed:', error);
        }
    };

    const handleStartPractice = (topicId: number) => {
        // Navigate to practice session
        window.location.href = `/practice/${topicId}`;
    };

    const dismissRecommendation = async (recommendationId: number) => {
        try {
            await fetch(`/api/learning/recommendation/${recommendationId}/dismiss`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                }
            });
            fetchDashboardData(); // Refresh data
        } catch (error) {
            console.error('Failed to dismiss recommendation:', error);
        }
    };

    const getSkillLevelColor = (level: string) => {
        switch (level) {
            case 'beginner': return 'bg-blue-100 text-blue-800';
            case 'intermediate': return 'bg-yellow-100 text-yellow-800';
            case 'advanced': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getReasonIcon = (reason: string) => {
        switch (reason) {
            case 'weak_area': return <Target className="h-4 w-4" />;
            case 'prerequisite': return <AlertCircle className="h-4 w-4" />;
            case 'next_level': return <TrendingUp className="h-4 w-4" />;
            case 'review': return <Clock className="h-4 w-4" />;
            default: return <BookOpen className="h-4 w-4" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Failed to load dashboard data</p>
                <Button onClick={fetchDashboardData} className="mt-4">
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Learning Dashboard</h1>
                    <p className="text-gray-600 mt-1">Track your progress and get personalized recommendations</p>
                </div>
                {dashboardData.needs_assessment && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        <Brain className="h-4 w-4 mr-1" />
                        Assessment Needed
                    </Badge>
                )}
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                                <p className="text-2xl font-bold">{dashboardData.analytics.overall_stats.total_tests_taken}</p>
                            </div>
                            <BarChart3 className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Average Score</p>
                                <p className="text-2xl font-bold">{dashboardData.analytics.overall_stats.average_score}%</p>
                            </div>
                            <Star className="h-8 w-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Topics Mastered</p>
                                <p className="text-2xl font-bold">{dashboardData.analytics.overall_stats.topics_mastered}</p>
                            </div>
                            <Award className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Study Time</p>
                                <p className="text-2xl font-bold">{Math.round(dashboardData.analytics.overall_stats.total_study_time / 60)}h</p>
                            </div>
                            <Clock className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                    <TabsTrigger value="progress">Progress</TabsTrigger>
                    <TabsTrigger value="skills">Skill Levels</TabsTrigger>
                </TabsList>

                {/* Recommendations Tab */}
                <TabsContent value="recommendations" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personalized Recommendations</CardTitle>
                            <CardDescription>
                                AI-powered suggestions to improve your learning
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {dashboardData.recommendations.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">
                                    No recommendations available. Complete some tests to get personalized suggestions!
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {dashboardData.recommendations.map((rec) => (
                                        <div key={rec.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {getReasonIcon(rec.reason)}
                                                        <h3 className="font-semibold">{rec.topic.title}</h3>
                                                        <Badge variant="outline" className={getSkillLevelColor(rec.topic.difficulty_level)}>
                                                            {rec.topic.difficulty_level}
                                                        </Badge>
                                                        <Badge variant="outline">
                                                            {rec.topic.subject}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">{rec.explanation}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Estimated time: {rec.topic.estimated_time} minutes
                                                    </p>
                                                    {rec.progress && (
                                                        <div className="mt-2 text-xs text-gray-500">
                                                            Previous best: {rec.progress.best_score}% ({rec.progress.attempts} attempts)
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button 
                                                        size="sm" 
                                                        onClick={() => handleStartPractice(rec.topic.id)}
                                                    >
                                                        <Play className="h-4 w-4 mr-1" />
                                                        Practice
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => dismissRecommendation(rec.id)}
                                                    >
                                                        Dismiss
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Progress Tab */}
                <TabsContent value="progress" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Object.entries(dashboardData.analytics.topic_progress).map(([subject, progress]) => (
                            <Card key={subject}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="h-5 w-5" />
                                        {subject}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span>Completed: {progress.completed}/{progress.total_topics}</span>
                                            <span>Average: {progress.average_score}%</span>
                                        </div>
                                        <Progress 
                                            value={(progress.completed / progress.total_topics) * 100} 
                                            className="w-full"
                                        />
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div className="text-green-600">
                                                <div className="text-lg font-bold">{progress.mastered}</div>
                                                <div className="text-xs">Mastered</div>
                                            </div>
                                            <div className="text-blue-600">
                                                <div className="text-lg font-bold">{progress.in_progress}</div>
                                                <div className="text-xs">In Progress</div>
                                            </div>
                                            <div className="text-gray-600">
                                                <div className="text-lg font-bold">{progress.total_topics - progress.completed}</div>
                                                <div className="text-xs">Not Started</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Skill Levels Tab */}
                <TabsContent value="skills" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Skill Levels</CardTitle>
                            <CardDescription>
                                Based on your recent assessments and performance
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {dashboardData.analytics.skill_levels.map((skill, index) => (
                                    <div key={index} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold">{skill.subject}</h3>
                                            {skill.needs_reassessment && (
                                                <Badge variant="outline" className="text-orange-600 border-orange-200">
                                                    Reassess
                                                </Badge>
                                            )}
                                        </div>
                                        <Badge className={getSkillLevelColor(skill.level)} variant="secondary">
                                            {skill.level}
                                        </Badge>
                                        <div className="mt-2 text-sm text-gray-600">
                                            <div>Score: {skill.score}%</div>
                                            <div>Last assessed: {skill.last_assessed}</div>
                                        </div>
                                        {skill.needs_reassessment && (
                                            <Button 
                                                className="w-full mt-3" 
                                                size="sm"
                                                onClick={() => handleStartAssessment(index + 1)} // Assuming subject IDs start from 1
                                            >
                                                Take Assessment
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {dashboardData.analytics.recent_activity.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                                ) : (
                                    <div className="space-y-3">
                                        {dashboardData.analytics.recent_activity.map((activity, index) => (
                                            <div key={index} className="flex items-center justify-between border-b pb-2">
                                                <div>
                                                    <p className="font-medium text-sm">{activity.topic}</p>
                                                    <p className="text-xs text-gray-500">{activity.subject}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-sm">{activity.score}%</p>
                                                    <p className="text-xs text-gray-500">{activity.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Top Recommendations */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Priority Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {dashboardData.recommendations.slice(0, 3).map((rec) => (
                                    <div key={rec.id} className="flex items-center justify-between border-b pb-2 mb-2">
                                        <div className="flex items-center gap-2">
                                            {getReasonIcon(rec.reason)}
                                            <div>
                                                <p className="font-medium text-sm">{rec.topic.title}</p>
                                                <p className="text-xs text-gray-500">{rec.explanation}</p>
                                            </div>
                                        </div>
                                        <Button size="sm" onClick={() => handleStartPractice(rec.topic.id)}>
                                            Start
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdaptiveLearningDashboard;