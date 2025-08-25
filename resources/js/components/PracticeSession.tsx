import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Progress } from '@/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group';
import { Label } from '@/ui/label';
import { 
    Clock, 
    CheckCircle, 
    XCircle, 
    ArrowRight, 
    ArrowLeft,
    Flag,
    RotateCcw,
    Trophy,
    Target
} from 'lucide-react';

interface Question {
    id: number;
    question: string;
    formulas?: any;
    images?: any;
    variants: {
        id: number;
        text: string;
        option_letter: string;
    }[];
}

interface Topic {
    id: number;
    title: string;
    difficulty_level: string;
}

interface PracticeSessionData {
    topic: Topic;
    questions: Question[];
    total_questions: number;
    time_limit: number;
}

interface UserAnswer {
    question_id: number;
    user_answer_id: number | null;
    is_flagged: boolean;
}

interface PracticeSessionProps {
    topicId: number;
    onComplete: (result: any) => void;
    onExit: () => void;
}

const PracticeSession: React.FC<PracticeSessionProps> = ({ topicId, onComplete, onExit }) => {
    const [sessionData, setSessionData] = useState<PracticeSessionData | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [startTime, setStartTime] = useState<Date | null>(null);

    useEffect(() => {
        startPracticeSession();
    }, [topicId]);

    useEffect(() => {
        if (timeRemaining > 0 && !isSubmitted) {
            const timer = setTimeout(() => {
                setTimeRemaining(timeRemaining - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeRemaining === 0 && !isSubmitted && sessionData) {
            handleSubmit();
        }
    }, [timeRemaining, isSubmitted]);

    const startPracticeSession = async () => {
        try {
            const response = await fetch(`/api/learning/topic/${topicId}/practice`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question_count: 10 })
            });
            
            if (response.ok) {
                const data = await response.json();
                setSessionData(data);
                setTimeRemaining(data.time_limit);
                setStartTime(new Date());
                
                // Initialize user answers
                const initialAnswers = data.questions.map((q: Question) => ({
                    question_id: q.id,
                    user_answer_id: null,
                    is_flagged: false
                }));
                setUserAnswers(initialAnswers);
            } else {
                console.error('Failed to start practice session');
            }
        } catch (error) {
            console.error('Error starting practice session:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId: number, variantId: number) => {
        setUserAnswers(prev => prev.map(answer => 
            answer.question_id === questionId 
                ? { ...answer, user_answer_id: variantId }
                : answer
        ));
    };

    const handleFlagQuestion = (questionId: number) => {
        setUserAnswers(prev => prev.map(answer => 
            answer.question_id === questionId 
                ? { ...answer, is_flagged: !answer.is_flagged }
                : answer
        ));
    };

    const handleNext = () => {
        if (currentQuestionIndex < (sessionData?.questions.length || 0) - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleQuestionJump = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    const handleSubmit = async () => {
        if (!sessionData || !startTime) return;

        const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
        const correctAnswers = calculateCorrectAnswers();
        
        const questionsData = userAnswers.map(answer => {
            const question = sessionData.questions.find(q => q.id === answer.question_id);
            const correctVariant = question?.variants.find(v => v.option_letter === 'A'); // Assuming A is always correct for demo
            
            return {
                question_id: answer.question_id,
                user_answer_id: answer.user_answer_id,
                correct_answer_id: correctVariant?.id || 0,
                is_correct: answer.user_answer_id === correctVariant?.id
            };
        });

        try {
            const response = await fetch('/api/learning/test/submit', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic_id: sessionData.topic.id,
                    test_name: `${sessionData.topic.title} - Practice Test`,
                    total_questions: sessionData.total_questions,
                    correct_answers: correctAnswers,
                    time_spent: timeSpent,
                    questions_data: questionsData,
                    test_type: 'practice',
                    difficulty_level: sessionData.topic.difficulty_level
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                setIsSubmitted(true);
                onComplete(result);
            }
        } catch (error) {
            console.error('Error submitting test:', error);
        }
    };

    const calculateCorrectAnswers = () => {
        if (!sessionData) return 0;
        
        let correct = 0;
        userAnswers.forEach(answer => {
            const question = sessionData.questions.find(q => q.id === answer.question_id);
            const correctVariant = question?.variants.find(v => v.option_letter === 'A'); // Demo logic
            if (answer.user_answer_id === correctVariant?.id) {
                correct++;
            }
        });
        return correct;
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const getAnsweredCount = () => {
        return userAnswers.filter(answer => answer.user_answer_id !== null).length;
    };

    const getFlaggedCount = () => {
        return userAnswers.filter(answer => answer.is_flagged).length;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!sessionData) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Failed to load practice session</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                    Retry
                </Button>
            </div>
        );
    }

    const currentQuestion = sessionData.questions[currentQuestionIndex];
    const currentAnswer = userAnswers.find(a => a.question_id === currentQuestion.id);
    const progress = ((currentQuestionIndex + 1) / sessionData.total_questions) * 100;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
                <div>
                    <h1 className="text-xl font-bold">{sessionData.topic.title}</h1>
                    <p className="text-gray-600">Practice Session</p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTime(timeRemaining)}
                    </Badge>
                    <Badge variant="outline">
                        {sessionData.topic.difficulty_level}
                    </Badge>
                    <Button variant="outline" onClick={onExit}>
                        Exit
                    </Button>
                </div>
            </div>

            {/* Progress Bar */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                            Question {currentQuestionIndex + 1} of {sessionData.total_questions}
                        </span>
                        <span className="text-sm text-gray-600">
                            {getAnsweredCount()}/{sessionData.total_questions} answered
                        </span>
                    </div>
                    <Progress value={progress} className="w-full" />
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Question Area */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleFlagQuestion(currentQuestion.id)}
                                    className={currentAnswer?.is_flagged ? 'bg-yellow-100 border-yellow-300' : ''}
                                >
                                    <Flag className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Question Text */}
                            <div className="text-lg font-medium">
                                {currentQuestion.question}
                            </div>

                            {/* Answer Options */}
                            <RadioGroup 
                                value={currentAnswer?.user_answer_id?.toString() || ''} 
                                onValueChange={(value) => handleAnswerSelect(currentQuestion.id, parseInt(value))}
                            >
                                {currentQuestion.variants.map((variant) => (
                                    <div key={variant.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                        <RadioGroupItem value={variant.id.toString()} id={variant.id.toString()} />
                                        <Label htmlFor={variant.id.toString()} className="flex-1 cursor-pointer">
                                            <span className="font-medium mr-2">{variant.option_letter}.</span>
                                            {variant.text}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between pt-4">
                                <Button 
                                    variant="outline" 
                                    onClick={handlePrevious}
                                    disabled={currentQuestionIndex === 0}
                                >
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>
                                
                                <div className="flex gap-2">
                                    {currentQuestionIndex === sessionData.total_questions - 1 ? (
                                        <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                                            <Trophy className="h-4 w-4 mr-1" />
                                            Submit Test
                                        </Button>
                                    ) : (
                                        <Button onClick={handleNext}>
                                            Next
                                            <ArrowRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Question Navigator */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Question Navigator</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-5 gap-2 mb-4">
                                {sessionData.questions.map((_, index) => {
                                    const answer = userAnswers[index];
                                    const isAnswered = answer?.user_answer_id !== null;
                                    const isFlagged = answer?.is_flagged;
                                    const isCurrent = index === currentQuestionIndex;
                                    
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleQuestionJump(index)}
                                            className={`
                                                w-8 h-8 rounded text-xs font-medium border transition-colors
                                                ${isCurrent ? 'border-blue-500 bg-blue-100 text-blue-700' : ''}
                                                ${isAnswered && !isCurrent ? 'bg-green-100 border-green-300 text-green-700' : ''}
                                                ${isFlagged ? 'bg-yellow-100 border-yellow-300' : ''}
                                                ${!isAnswered && !isCurrent && !isFlagged ? 'bg-gray-50 border-gray-200 hover:bg-gray-100' : ''}
                                            `}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            {/* Legend */}
                            <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                                    <span>Current</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                                    <span>Answered</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                                    <span>Flagged</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
                                    <span>Not answered</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Answered:</span>
                                    <span className="font-medium">{getAnsweredCount()}/{sessionData.total_questions}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Flagged:</span>
                                    <span className="font-medium">{getFlaggedCount()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Time left:</span>
                                    <span className="font-medium">{formatTime(timeRemaining)}</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button 
                                className="w-full mt-4" 
                                onClick={handleSubmit}
                                variant={getAnsweredCount() === sessionData.total_questions ? "default" : "outline"}
                            >
                                <Trophy className="h-4 w-4 mr-1" />
                                Submit Test
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PracticeSession;