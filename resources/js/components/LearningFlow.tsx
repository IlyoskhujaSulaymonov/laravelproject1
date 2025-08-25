import React, { useState, useEffect } from 'react';
import AdaptiveLearningDashboard from './AdaptiveLearningDashboard';
import SkillAssessment from './SkillAssessment';
import TopicMaterialsViewer from './TopicMaterialsViewer';
import PracticeSession from './PracticeSession';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { 
    BookOpen, 
    Brain, 
    Target, 
    Trophy,
    ArrowRight,
    Play,
    Star,
    CheckCircle
} from 'lucide-react';

interface Topic {
    id: number;
    title: string;
    description: string;
    difficulty_level: string;
    estimated_time: number;
    subject: {
        id: number;
        name: string;
    };
    prerequisites_completed: boolean;
    progress?: {
        status: string;
        best_score: number;
        attempts: number;
        accuracy: number;
        last_attempted: string;
        estimated_study_time: number;
    };
    question_count: number;
}

interface LearningFlowProps {
    initialView?: 'dashboard' | 'assessment' | 'topics' | 'materials' | 'practice';
}

type ViewType = 'dashboard' | 'assessment' | 'topics' | 'materials' | 'practice' | 'results';

const LearningFlow: React.FC<LearningFlowProps> = ({ initialView = 'dashboard' }) => {
    const [currentView, setCurrentView] = useState<ViewType>(initialView);
    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
    const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);
    const [needsAssessment, setNeedsAssessment] = useState(false);
    const [loading, setLoading] = useState(false);
    const [practiceResult, setPracticeResult] = useState<any>(null);

    useEffect(() => {
        // Check if user needs initial assessment
        checkAssessmentStatus();
    }, []);

    const checkAssessmentStatus = async () => {
        try {
            const response = await fetch('/api/learning/dashboard', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setNeedsAssessment(data.needs_assessment);
                if (data.needs_assessment && currentView === 'dashboard') {
                    setCurrentView('assessment');
                }
            }
        } catch (error) {
            console.error('Failed to check assessment status:', error);
        }
    };

    const fetchAvailableTopics = async (subjectId?: number) => {
        setLoading(true);
        try {
            const url = subjectId ? `/api/learning/topics/${subjectId}` : '/api/learning/topics';
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setAvailableTopics(data.topics || []);
            }
        } catch (error) {
            console.error('Failed to fetch topics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssessmentComplete = (result: any) => {
        setNeedsAssessment(false);
        setCurrentView('dashboard');
        // Optionally show assessment results
        console.log('Assessment completed:', result);
    };

    const handleStartPractice = (topicId: number) => {
        setSelectedTopicId(topicId);
        setCurrentView('practice');
    };

    const handleViewMaterials = (topicId: number) => {
        setSelectedTopicId(topicId);
        setCurrentView('materials');
    };

    const handlePracticeComplete = (result: any) => {
        setPracticeResult(result);
        setCurrentView('results');
    };

    const handleBackToDashboard = () => {
        setCurrentView('dashboard');
        setSelectedTopicId(null);
        setPracticeResult(null);
    };

    const handleBackToTopics = () => {
        setCurrentView('topics');
        setSelectedTopicId(null);
    };

    const getDifficultyColor = (level: string) => {
        switch (level) {
            case 'beginner': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'advanced': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'mastered': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'in_progress': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Render different views based on current state
    switch (currentView) {
        case 'assessment':
            return (
                <SkillAssessment 
                    onComplete={handleAssessmentComplete}
                    onCancel={handleBackToDashboard}
                />
            );

        case 'topics':
            return (
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Available Topics</h1>
                            <p className="text-gray-600 mt-1">Choose a topic to study and practice</p>
                        </div>
                        <Button variant="outline" onClick={handleBackToDashboard}>
                            ← Back to Dashboard
                        </Button>
                    </div>

                    {/* Topics Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {availableTopics.map((topic) => (
                                <Card key={topic.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-lg">{topic.title}</CardTitle>
                                            <div className="flex flex-col gap-1">
                                                <Badge variant="outline" className={getDifficultyColor(topic.difficulty_level)}>
                                                    {topic.difficulty_level}
                                                </Badge>
                                                {topic.progress && (
                                                    <Badge variant="outline" className={getStatusColor(topic.progress.status)}>
                                                        {topic.progress.status}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <CardDescription>{topic.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {/* Topic Stats */}
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4 text-gray-500" />
                                                    <span>{topic.estimated_time}m</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <BookOpen className="h-4 w-4 text-gray-500" />
                                                    <span>{topic.question_count} questions</span>
                                                </div>
                                            </div>

                                            {/* Progress Info */}
                                            {topic.progress && (
                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex justify-between text-sm">
                                                        <span>Best Score:</span>
                                                        <span className="font-semibold">{topic.progress.best_score}%</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span>Attempts:</span>
                                                        <span className="font-semibold">{topic.progress.attempts}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Subject Badge */}
                                            <Badge variant="outline">
                                                {topic.subject.name}
                                            </Badge>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => handleViewMaterials(topic.id)}
                                                    className="flex-1"
                                                >
                                                    <BookOpen className="h-4 w-4 mr-1" />
                                                    Study
                                                </Button>
                                                <Button 
                                                    size="sm"
                                                    onClick={() => handleStartPractice(topic.id)}
                                                    className="flex-1"
                                                    disabled={!topic.prerequisites_completed}
                                                >
                                                    <Play className="h-4 w-4 mr-1" />
                                                    Practice
                                                </Button>
                                            </div>

                                            {!topic.prerequisites_completed && (
                                                <p className="text-xs text-orange-600">
                                                    Complete prerequisites first
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Load Topics Button */}
                    {availableTopics.length === 0 && !loading && (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">No topics available</p>
                            <Button onClick={() => fetchAvailableTopics()}>
                                Load Topics
                            </Button>
                        </div>
                    )}
                </div>
            );

        case 'materials':
            return selectedTopicId ? (
                <TopicMaterialsViewer 
                    topicId={selectedTopicId}
                    onStartPractice={() => handleStartPractice(selectedTopicId)}
                    onBack={handleBackToTopics}
                />
            ) : null;

        case 'practice':
            return selectedTopicId ? (
                <PracticeSession 
                    topicId={selectedTopicId}
                    onComplete={handlePracticeComplete}
                    onExit={handleBackToTopics}
                />
            ) : null;

        case 'results':
            return (
                <div className="max-w-2xl mx-auto space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center flex items-center justify-center gap-2">
                                <Trophy className="h-6 w-6 text-yellow-500" />
                                Practice Complete!
                            </CardTitle>
                            <CardDescription className="text-center">
                                Here's how you performed
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {practiceResult && (
                                <>
                                    {/* Score Display */}
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-blue-600 mb-2">
                                            {practiceResult.test?.score_percentage || 0}%
                                        </div>
                                        <Badge variant="outline" className="text-lg px-4 py-2">
                                            {practiceResult.test?.grade || 'N/A'}
                                        </Badge>
                                    </div>

                                    {/* Performance Stats */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-4 border rounded-lg">
                                            <div className="text-2xl font-bold">{practiceResult.progress?.best_score || 0}%</div>
                                            <div className="text-sm text-gray-600">Best Score</div>
                                        </div>
                                        <div className="text-center p-4 border rounded-lg">
                                            <div className="text-2xl font-bold">{practiceResult.progress?.attempts || 0}</div>
                                            <div className="text-sm text-gray-600">Total Attempts</div>
                                        </div>
                                    </div>

                                    {/* Progress Status */}
                                    {practiceResult.progress && (
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <span>Status:</span>
                                                <Badge className={getStatusColor(practiceResult.progress.status)}>
                                                    {practiceResult.progress.status}
                                                </Badge>
                                            </div>
                                            {practiceResult.progress.needs_more_practice && (
                                                <p className="text-sm text-orange-600 mt-2">
                                                    Consider practicing more to improve your understanding
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Recommendations */}
                                    {practiceResult.recommendations && practiceResult.recommendations.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold mb-3">Next Recommendations</h4>
                                            <div className="space-y-2">
                                                {practiceResult.recommendations.slice(0, 3).map((rec: any, index: number) => (
                                                    <div key={index} className="p-3 border rounded-lg">
                                                        <h5 className="font-medium">{rec.topic?.title}</h5>
                                                        <p className="text-sm text-gray-600">{rec.explanation}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 justify-center">
                                <Button variant="outline" onClick={handleBackToTopics}>
                                    Practice More Topics
                                </Button>
                                <Button onClick={handleBackToDashboard}>
                                    Back to Dashboard
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );

        case 'dashboard':
        default:
            return (
                <div className="space-y-6">
                    <AdaptiveLearningDashboard />
                    
                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Jump into learning activities
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button 
                                    variant="outline" 
                                    className="h-20 flex flex-col gap-2"
                                    onClick={() => {
                                        fetchAvailableTopics();
                                        setCurrentView('topics');
                                    }}
                                >
                                    <BookOpen className="h-6 w-6" />
                                    Browse Topics
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="h-20 flex flex-col gap-2"
                                    onClick={() => setCurrentView('assessment')}
                                >
                                    <Brain className="h-6 w-6" />
                                    Take Assessment
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="h-20 flex flex-col gap-2"
                                    onClick={() => {
                                        fetchAvailableTopics();
                                        setCurrentView('topics');
                                    }}
                                >
                                    <Target className="h-6 w-6" />
                                    Practice Now
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
    }
};

export default LearningFlow;