import React, { useState, useEffect } from 'react';
import LearningFlow from '@/components/LearningFlow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { 
    Brain, 
    BookOpen, 
    Target, 
    TrendingUp,
    Star,
    Award,
    Clock,
    CheckCircle,
    User
} from 'lucide-react';

interface UserProfile {
    id: number;
    name: string;
    email: string;
}

interface WelcomeProps {
    user: UserProfile;
    onGetStarted: () => void;
}

const WelcomeScreen: React.FC<WelcomeProps> = ({ user, onGetStarted }) => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12">
                <div className="flex items-center justify-center mb-6">
                    <Brain className="h-16 w-16 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold mb-4">
                    Welcome to Adaptive Learning
                </h1>
                <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
                    Personalized education that adapts to your learning style. 
                    Master topics at your own pace with AI-powered recommendations.
                </p>
                <Badge variant="outline" className="mb-6">
                    <User className="h-4 w-4 mr-1" />
                    Welcome, {user.name}!
                </Badge>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center">
                    <CardHeader>
                        <Brain className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                        <CardTitle className="text-lg">Skill Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            Take assessments to determine your current skill level in each subject
                        </p>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardHeader>
                        <Target className="h-12 w-12 text-green-600 mx-auto mb-2" />
                        <CardTitle className="text-lg">Personalized Learning</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            Get topics and materials tailored to your skill level and learning goals
                        </p>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardHeader>
                        <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                        <CardTitle className="text-lg">Progress Tracking</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            Monitor your progress and see detailed analytics of your learning journey
                        </p>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardHeader>
                        <Award className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
                        <CardTitle className="text-lg">Smart Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            AI-powered suggestions for what to study next based on your performance
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* How It Works */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">How It Works</CardTitle>
                    <CardDescription className="text-center">
                        Your personalized learning journey in simple steps
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-blue-600 font-bold">1</span>
                            </div>
                            <h3 className="font-semibold mb-2">Take Assessment</h3>
                            <p className="text-sm text-gray-600">
                                Complete skill assessments to determine your starting level
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-green-600 font-bold">2</span>
                            </div>
                            <h3 className="font-semibold mb-2">Study Materials</h3>
                            <p className="text-sm text-gray-600">
                                Access personalized learning materials for each topic
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-purple-600 font-bold">3</span>
                            </div>
                            <h3 className="font-semibold mb-2">Practice & Test</h3>
                            <p className="text-sm text-gray-600">
                                Take practice tests to reinforce your learning
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-yellow-600 font-bold">4</span>
                            </div>
                            <h3 className="font-semibold mb-2">Get Recommendations</h3>
                            <p className="text-sm text-gray-600">
                                Receive AI-powered suggestions for continued learning
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Get Started */}
            <div className="text-center">
                <Button 
                    onClick={onGetStarted}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
                >
                    Get Started with Learning
                    <BookOpen className="h-5 w-5 ml-2" />
                </Button>
                <p className="text-sm text-gray-500 mt-3">
                    Your learning journey begins here
                </p>
            </div>
        </div>
    );
};

const LearningPage: React.FC = () => {
    const [showWelcome, setShowWelcome] = useState(true);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserProfile();
        checkIfFirstTime();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch('/api/user', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkIfFirstTime = () => {
        const hasVisited = localStorage.getItem('learning_page_visited');
        if (hasVisited) {
            setShowWelcome(false);
        }
    };

    const handleGetStarted = () => {
        localStorage.setItem('learning_page_visited', 'true');
        setShowWelcome(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Authentication Required</CardTitle>
                        <CardDescription>
                            Please log in to access the learning platform
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button 
                            onClick={() => window.location.href = '/login'}
                            className="w-full"
                        >
                            Go to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Brain className="h-8 w-8 text-blue-600 mr-3" />
                            <h1 className="text-xl font-bold">Adaptive Learning</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Badge variant="outline">
                                <User className="h-4 w-4 mr-1" />
                                {user.name}
                            </Badge>
                            {!showWelcome && (
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setShowWelcome(true)}
                                >
                                    Help
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {showWelcome ? (
                        <WelcomeScreen 
                            user={user} 
                            onGetStarted={handleGetStarted}
                        />
                    ) : (
                        <LearningFlow />
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-12">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-gray-500 text-sm">
                        <p>© 2025 Edu System - Adaptive Learning Platform</p>
                        <p className="mt-1">Personalized education powered by AI</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LearningPage;