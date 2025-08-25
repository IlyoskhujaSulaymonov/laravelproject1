import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Progress } from '@/ui/progress';
import { 
    Brain, 
    Clock, 
    Target, 
    TrendingUp, 
    CheckCircle, 
    Star,
    Award,
    BarChart3
} from 'lucide-react';

interface Subject {
    id: number;
    name: string;
    description?: string;
}

interface AssessmentResult {
    skill_level: 'beginner' | 'intermediate' | 'advanced';
    score: number;
    recommendations: any[];
}

interface SkillAssessmentProps {
    onComplete: (result: AssessmentResult) => void;
    onCancel: () => void;
}

const SkillAssessment: React.FC<SkillAssessmentProps> = ({ onComplete, onCancel }) => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [isAssessing, setIsAssessing] = useState(false);
    const [assessmentStep, setAssessmentStep] = useState<'select' | 'info' | 'assessing' | 'completed'>('select');
    const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const response = await fetch('/api/user-tests/subjects', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setSubjects(data.subjects || []);
            }
        } catch (error) {
            console.error('Failed to fetch subjects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubjectSelect = (subject: Subject) => {
        setSelectedSubject(subject);
        setAssessmentStep('info');
    };

    const startAssessment = async () => {
        if (!selectedSubject) return;

        setIsAssessing(true);
        setAssessmentStep('assessing');

        try {
            const response = await fetch(`/api/learning/assessment/${selectedSubject.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ questions_per_level: 5 })
            });
            
            if (response.ok) {
                const result = await response.json();
                setAssessmentResult(result.result);
                setAssessmentStep('completed');
            } else {
                console.error('Assessment failed');
            }
        } catch (error) {
            console.error('Error during assessment:', error);
        } finally {
            setIsAssessing(false);
        }
    };

    const handleComplete = () => {
        if (assessmentResult) {
            onComplete(assessmentResult);
        }
    };

    const getSkillLevelInfo = (level: string) => {
        switch (level) {
            case 'beginner':
                return {
                    color: 'bg-blue-100 text-blue-800 border-blue-200',
                    icon: <Target className="h-5 w-5" />,
                    description: 'You have basic understanding and should start with fundamental concepts.',
                    nextSteps: 'Focus on building a strong foundation with basic topics.'
                };
            case 'intermediate':
                return {
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    icon: <TrendingUp className="h-5 w-5" />,
                    description: 'You have solid understanding and can tackle more challenging topics.',
                    nextSteps: 'Practice intermediate topics and prepare for advanced concepts.'
                };
            case 'advanced':
                return {
                    color: 'bg-green-100 text-green-800 border-green-200',
                    icon: <Award className="h-5 w-5" />,
                    description: 'You have strong mastery and can handle complex problems.',
                    nextSteps: 'Challenge yourself with advanced topics and real-world applications.'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: <Star className="h-5 w-5" />,
                    description: 'Assessment in progress...',
                    nextSteps: ''
                };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                    <Brain className="h-12 w-12 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold">Skill Assessment</h1>
                <p className="text-gray-600 mt-2">
                    Let's determine your current skill level to personalize your learning experience
                </p>
            </div>

            {/* Subject Selection */}
            {assessmentStep === 'select' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Choose a Subject for Assessment</CardTitle>
                        <CardDescription>
                            Select the subject you'd like to be assessed on. This will help us understand your current level.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-3">
                            {subjects.map((subject) => (
                                <button
                                    key={subject.id}
                                    onClick={() => handleSubjectSelect(subject)}
                                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold">{subject.name}</h3>
                                            {subject.description && (
                                                <p className="text-sm text-gray-600 mt-1">{subject.description}</p>
                                            )}
                                        </div>
                                        <BarChart3 className="h-5 w-5 text-gray-400" />
                                    </div>
                                </button>
                            ))}
                        </div>
                        
                        <div className="flex justify-center mt-6">
                            <Button variant="outline" onClick={onCancel}>
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Assessment Information */}
            {assessmentStep === 'info' && selectedSubject && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            {selectedSubject.name} Assessment
                        </CardTitle>
                        <CardDescription>
                            Here's what you need to know about the assessment process
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 border rounded-lg">
                                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <h3 className="font-semibold">15-20 Minutes</h3>
                                <p className="text-sm text-gray-600">Estimated time</p>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                <h3 className="font-semibold">15 Questions</h3>
                                <p className="text-sm text-gray-600">Across difficulty levels</p>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                                <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                <h3 className="font-semibold">AI Analysis</h3>
                                <p className="text-sm text-gray-600">Personalized results</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">Assessment Process:</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• You'll answer questions from beginner to advanced levels</li>
                                <li>• The system adapts based on your performance</li>
                                <li>• Your skill level will be determined automatically</li>
                                <li>• You'll receive personalized learning recommendations</li>
                            </ul>
                        </div>

                        <div className="flex gap-3 justify-center">
                            <Button variant="outline" onClick={() => setAssessmentStep('select')}>
                                Back to Subjects
                            </Button>
                            <Button onClick={startAssessment} className="bg-blue-600 hover:bg-blue-700">
                                Start Assessment
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Assessment in Progress */}
            {assessmentStep === 'assessing' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Assessment in Progress</CardTitle>
                        <CardDescription className="text-center">
                            We're analyzing your responses and determining your skill level...
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="text-center">
                                <h3 className="font-semibold mb-2">Processing Assessment Data</h3>
                                <Progress value={66} className="w-full" />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
                                    <p className="text-sm text-green-800">Questions Analyzed</p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <Brain className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                                    <p className="text-sm text-blue-800">AI Processing</p>
                                </div>
                                <div className="p-3 bg-yellow-50 rounded-lg">
                                    <Star className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                                    <p className="text-sm text-yellow-800">Generating Results</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Assessment Results */}
            {assessmentStep === 'completed' && assessmentResult && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center flex items-center justify-center gap-2">
                            <Trophy className="h-6 w-6 text-yellow-500" />
                            Assessment Complete!
                        </CardTitle>
                        <CardDescription className="text-center">
                            Here are your personalized results and recommendations
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Skill Level Result */}
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-4">
                                <div className={`p-4 rounded-full ${getSkillLevelInfo(assessmentResult.skill_level).color}`}>
                                    {getSkillLevelInfo(assessmentResult.skill_level).icon}
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">
                                {assessmentResult.skill_level.charAt(0).toUpperCase() + assessmentResult.skill_level.slice(1)} Level
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {getSkillLevelInfo(assessmentResult.skill_level).description}
                            </p>
                            <Badge variant="outline" className="text-lg px-4 py-2">
                                Score: {assessmentResult.score}%
                            </Badge>
                        </div>

                        {/* Score Breakdown */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-3">Your Performance</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Overall Score:</span>
                                    <span className="font-semibold">{assessmentResult.score}%</span>
                                </div>
                                <Progress value={assessmentResult.score} className="w-full" />
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
                            <p className="text-blue-800 text-sm">
                                {getSkillLevelInfo(assessmentResult.skill_level).nextSteps}
                            </p>
                        </div>

                        {/* Recommendations */}
                        {assessmentResult.recommendations && assessmentResult.recommendations.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-3">Recommended Topics</h4>
                                <div className="space-y-2">
                                    {assessmentResult.recommendations.slice(0, 3).map((rec: any, index: number) => (
                                        <div key={index} className="p-3 border rounded-lg">
                                            <h5 className="font-medium">{rec.topic?.title || `Recommendation ${index + 1}`}</h5>
                                            <p className="text-sm text-gray-600">{rec.explanation}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 justify-center">
                            <Button variant="outline" onClick={onCancel}>
                                Take Another Assessment
                            </Button>
                            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                                Continue to Dashboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default SkillAssessment;