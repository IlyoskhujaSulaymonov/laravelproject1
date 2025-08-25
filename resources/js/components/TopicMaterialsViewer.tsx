import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Progress } from '@/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { 
    BookOpen, 
    Play, 
    Clock, 
    Target, 
    CheckCircle,
    Video,
    FileText,
    Brain,
    ArrowRight,
    ExternalLink,
    Download
} from 'lucide-react';

interface TopicMaterials {
    topic: {
        id: number;
        title: string;
        description: string;
        learning_objectives: string;
        materials: {
            text?: string;
            videos?: Array<{title: string; url: string}>;
            examples?: string[];
            key_concepts?: string[];
            formulas?: string[];
            practice_problems?: string[];
            applications?: string[];
            real_world_examples?: string[];
        };
        estimated_time: number;
        difficulty_level: string;
        subject: string;
    };
    progress: {
        status: string;
        best_score: number;
        attempts: number;
        last_attempted: string;
    } | null;
    prerequisites: Array<{
        id: number;
        title: string;
    }>;
}

interface TopicMaterialsViewerProps {
    topicId: number;
    onStartPractice: () => void;
    onBack: () => void;
}

const TopicMaterialsViewer: React.FC<TopicMaterialsViewerProps> = ({ 
    topicId, 
    onStartPractice, 
    onBack 
}) => {
    const [materialsData, setMaterialsData] = useState<TopicMaterials | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchTopicMaterials();
    }, [topicId]);

    const fetchTopicMaterials = async () => {
        try {
            const response = await fetch(`/api/learning/topic/${topicId}/materials`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setMaterialsData(data);
            } else {
                console.error('Failed to fetch topic materials');
            }
        } catch (error) {
            console.error('Error fetching topic materials:', error);
        } finally {
            setLoading(false);
        }
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!materialsData) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Failed to load topic materials</p>
                <Button onClick={fetchTopicMaterials} className="mt-4">
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="outline" onClick={onBack}>
                    ← Back to Topics
                </Button>
                <Button onClick={onStartPractice} className="bg-blue-600 hover:bg-blue-700">
                    <Play className="h-4 w-4 mr-1" />
                    Start Practice
                </Button>
            </div>

            {/* Topic Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-2xl mb-2">{materialsData.topic.title}</CardTitle>
                            <CardDescription className="text-base">
                                {materialsData.topic.description}
                            </CardDescription>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Badge variant="outline" className={getDifficultyColor(materialsData.topic.difficulty_level)}>
                                {materialsData.topic.difficulty_level}
                            </Badge>
                            <Badge variant="outline">
                                {materialsData.topic.subject}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-gray-500" />
                            <span className="text-sm">
                                {materialsData.topic.estimated_time} minutes
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-gray-500" />
                            <span className="text-sm">
                                {materialsData.topic.difficulty_level} level
                            </span>
                        </div>
                        {materialsData.progress && (
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-gray-500" />
                                <Badge variant="outline" className={getStatusColor(materialsData.progress.status)}>
                                    {materialsData.progress.status}
                                </Badge>
                            </div>
                        )}
                    </div>

                    {materialsData.progress && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-2">Your Progress</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Best Score:</span>
                                    <span className="ml-2 font-semibold">{materialsData.progress.best_score}%</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Attempts:</span>
                                    <span className="ml-2 font-semibold">{materialsData.progress.attempts}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Last Attempt:</span>
                                    <span className="ml-2 font-semibold">{materialsData.progress.last_attempted}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Prerequisites */}
            {materialsData.prerequisites && materialsData.prerequisites.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Prerequisites</CardTitle>
                        <CardDescription>
                            Make sure you've completed these topics first
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {materialsData.prerequisites.map((prereq) => (
                                <Badge key={prereq.id} variant="outline" className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    {prereq.title}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Learning Materials */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="examples">Examples</TabsTrigger>
                    <TabsTrigger value="practice">Practice</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Brain className="h-5 w-5" />
                                Learning Objectives
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 leading-relaxed">
                                {materialsData.topic.learning_objectives}
                            </p>
                        </CardContent>
                    </Card>

                    {materialsData.topic.materials?.key_concepts && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Key Concepts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {materialsData.topic.materials.key_concepts.map((concept, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                            <span>{concept}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-4">
                    {materialsData.topic.materials?.text && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Reading Material
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed">
                                        {materialsData.topic.materials.text}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {materialsData.topic.materials?.videos && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Video className="h-5 w-5" />
                                    Video Resources
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {materialsData.topic.materials.videos.map((video, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Video className="h-6 w-6 text-blue-600" />
                                                <span className="font-medium">{video.title}</span>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                <ExternalLink className="h-4 w-4 mr-1" />
                                                Watch
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {materialsData.topic.materials?.formulas && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Important Formulas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {materialsData.topic.materials.formulas.map((formula, index) => (
                                        <div key={index} className="p-3 bg-gray-50 rounded-lg font-mono text-center">
                                            {formula}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Examples Tab */}
                <TabsContent value="examples" className="space-y-4">
                    {materialsData.topic.materials?.examples && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Worked Examples</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {materialsData.topic.materials.examples.map((example, index) => (
                                        <div key={index} className="p-4 border-l-4 border-blue-500 bg-blue-50">
                                            <div className="font-mono">{example}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {materialsData.topic.materials?.applications && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Real-World Applications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {materialsData.topic.materials.applications.map((app, index) => (
                                        <div key={index} className="p-3 border rounded-lg">
                                            <p className="text-gray-700">{app}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {materialsData.topic.materials?.real_world_examples && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Examples in Practice</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {materialsData.topic.materials.real_world_examples.map((example, index) => (
                                        <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <p className="text-green-800">{example}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Practice Tab */}
                <TabsContent value="practice" className="space-y-4">
                    {materialsData.topic.materials?.practice_problems && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Practice Problems</CardTitle>
                                <CardDescription>
                                    Try these problems to test your understanding before taking the quiz
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {materialsData.topic.materials.practice_problems.map((problem, index) => (
                                        <div key={index} className="p-4 border rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <Badge variant="outline" className="mt-1">{index + 1}</Badge>
                                                <p className="flex-1">{problem}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Ready for Practice?</CardTitle>
                            <CardDescription>
                                When you feel comfortable with the material, start practicing with interactive questions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                <div>
                                    <h4 className="font-semibold text-blue-900">Practice Test</h4>
                                    <p className="text-sm text-blue-700">
                                        Take a practice test to reinforce your learning
                                    </p>
                                </div>
                                <Button onClick={onStartPractice} className="bg-blue-600 hover:bg-blue-700">
                                    Start Practice
                                    <ArrowRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TopicMaterialsViewer;