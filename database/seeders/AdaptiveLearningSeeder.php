<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\Question;
use App\Models\Variant;
use App\Models\User;
use App\Models\UserSkillLevel;
use App\Models\UserTopicProgress;

class AdaptiveLearningSeeder extends Seeder
{
    /**
     * Run the database seeders.
     */
    public function run(): void
    {
        // Create Mathematics subject if it doesn't exist
        $mathematics = Subject::firstOrCreate([
            'name' => 'Mathematics',
            'code' => 'MATH'
        ], [
            'description' => 'Mathematical concepts and problem solving'
        ]);

        // Create topics with different difficulty levels and learning materials
        $topics = [
            // Beginner Level
            [
                'title' => 'Basic Numbers and Operations',
                'difficulty_level' => 'beginner',
                'description' => 'Learn about natural numbers, integers, and basic arithmetic operations',
                'learning_objectives' => 'Understand number types, perform basic calculations, solve simple word problems',
                'estimated_time' => 30,
                'is_assessment' => true,
                'materials' => [
                    'text' => 'Numbers are the foundation of mathematics. We use them to count, measure, and solve problems.',
                    'videos' => [
                        ['title' => 'Introduction to Numbers', 'url' => 'https://example.com/video1'],
                        ['title' => 'Basic Operations', 'url' => 'https://example.com/video2']
                    ],
                    'examples' => [
                        '5 + 3 = 8',
                        '10 - 4 = 6',
                        '6 × 2 = 12',
                        '15 ÷ 3 = 5'
                    ]
                ],
                'prerequisites' => []
            ],
            [
                'title' => 'Fractions and Decimals',
                'difficulty_level' => 'beginner',
                'description' => 'Understanding parts of a whole using fractions and decimal notation',
                'learning_objectives' => 'Convert between fractions and decimals, compare fractional values, perform basic operations',
                'estimated_time' => 45,
                'materials' => [
                    'text' => 'Fractions represent parts of a whole. Decimals are another way to express fractions.',
                    'key_concepts' => [
                        'Numerator and denominator',
                        'Equivalent fractions',
                        'Decimal place value',
                        'Converting fractions to decimals'
                    ]
                ],
                'prerequisites' => []
            ],

            // Intermediate Level
            [
                'title' => 'Algebraic Expressions',
                'difficulty_level' => 'intermediate',
                'description' => 'Introduction to variables, expressions, and basic algebraic manipulation',
                'learning_objectives' => 'Use variables, simplify expressions, solve simple equations',
                'estimated_time' => 60,
                'is_assessment' => true,
                'materials' => [
                    'text' => 'Algebra uses letters to represent unknown numbers. We can manipulate these expressions using mathematical rules.',
                    'formulas' => [
                        'ax + b = c',
                        'x = (c - b) / a',
                        '(a + b)² = a² + 2ab + b²'
                    ],
                    'practice_problems' => [
                        'Solve: 2x + 5 = 13',
                        'Simplify: 3x + 2x - x',
                        'Expand: (x + 3)(x + 2)'
                    ]
                ],
                'prerequisites' => []
            ],
            [
                'title' => 'Linear Equations',
                'difficulty_level' => 'intermediate',
                'description' => 'Solving linear equations in one variable and understanding their graphs',
                'learning_objectives' => 'Solve linear equations, graph linear functions, interpret slope and intercept',
                'estimated_time' => 75,
                'materials' => [
                    'text' => 'Linear equations form straight lines when graphed. They have the form y = mx + b.',
                    'key_concepts' => [
                        'Slope-intercept form',
                        'Point-slope form',
                        'Standard form',
                        'Graphing techniques'
                    ]
                ],
                'prerequisites' => []
            ],

            // Advanced Level
            [
                'title' => 'Quadratic Functions',
                'difficulty_level' => 'advanced',
                'description' => 'Understanding quadratic functions, their graphs, and solving quadratic equations',
                'learning_objectives' => 'Solve quadratic equations, graph parabolas, find vertex and roots',
                'estimated_time' => 90,
                'is_assessment' => true,
                'materials' => [
                    'text' => 'Quadratic functions create parabolic curves. They have the form f(x) = ax² + bx + c.',
                    'formulas' => [
                        'Quadratic formula: x = (-b ± √(b² - 4ac)) / 2a',
                        'Vertex form: f(x) = a(x - h)² + k',
                        'Discriminant: Δ = b² - 4ac'
                    ],
                    'applications' => [
                        'Projectile motion',
                        'Optimization problems',
                        'Revenue and profit calculations'
                    ]
                ],
                'prerequisites' => []
            ],
            [
                'title' => 'Calculus Introduction',
                'difficulty_level' => 'advanced',
                'description' => 'Basic concepts of limits, derivatives, and their applications',
                'learning_objectives' => 'Understand limits, calculate basic derivatives, apply to real-world problems',
                'estimated_time' => 120,
                'materials' => [
                    'text' => 'Calculus studies rates of change and areas. It consists of differential and integral calculus.',
                    'key_concepts' => [
                        'Limits and continuity',
                        'Derivative rules',
                        'Chain rule',
                        'Applications of derivatives'
                    ],
                    'real_world_examples' => [
                        'Velocity and acceleration',
                        'Optimization in business',
                        'Population growth models'
                    ]
                ],
                'prerequisites' => []
            ]
        ];

        // Create topics
        $createdTopics = [];
        foreach ($topics as $index => $topicData) {
            $topic = Topic::create([
                'subject_id' => $mathematics->id,
                'title' => $topicData['title'],
                'order' => $index + 1,
                'difficulty_level' => $topicData['difficulty_level'],
                'description' => $topicData['description'],
                'learning_objectives' => $topicData['learning_objectives'],
                'materials' => $topicData['materials'],
                'estimated_time' => $topicData['estimated_time'],
                'is_assessment' => $topicData['is_assessment'] ?? false,
                'min_score_to_pass' => 70,
                'prerequisites' => $topicData['prerequisites']
            ]);
            
            $createdTopics[] = $topic;
        }

        // Set up prerequisites (later topics depend on earlier ones)
        $createdTopics[2]->update(['prerequisites' => [$createdTopics[0]->id, $createdTopics[1]->id]]);
        $createdTopics[3]->update(['prerequisites' => [$createdTopics[2]->id]]);
        $createdTopics[4]->update(['prerequisites' => [$createdTopics[3]->id]]);
        $createdTopics[5]->update(['prerequisites' => [$createdTopics[4]->id]]);

        // Create sample questions for each topic
        foreach ($createdTopics as $topic) {
            $this->createSampleQuestions($topic);
        }

        // Create sample user progress for existing users
        $users = User::where('role', User::ROLE_USER)->limit(5)->get();
        foreach ($users as $user) {
            $this->createSampleUserProgress($user, $mathematics, $createdTopics);
        }
    }

    private function createSampleQuestions(Topic $topic)
    {
        $questionsData = $this->getQuestionsForTopic($topic->title, $topic->difficulty_level);
        
        foreach ($questionsData as $questionData) {
            $question = Question::create([
                'topic_id' => $topic->id,
                'question' => $questionData['question'],
                'formulas' => $questionData['formulas'] ?? null,
                'images' => null
            ]);

            foreach ($questionData['variants'] as $variantData) {
                Variant::create([
                    'question_id' => $question->id,
                    'text' => $variantData['text'],
                    'is_correct' => $variantData['is_correct'],
                    'option_letter' => $variantData['option_letter']
                ]);
            }
        }
    }

    private function getQuestionsForTopic($topicTitle, $difficulty)
    {
        $questions = [
            'Basic Numbers and Operations' => [
                [
                    'question' => 'What is 15 + 27?',
                    'variants' => [
                        ['text' => '42', 'is_correct' => true, 'option_letter' => 'A'],
                        ['text' => '32', 'is_correct' => false, 'option_letter' => 'B'],
                        ['text' => '41', 'is_correct' => false, 'option_letter' => 'C'],
                        ['text' => '43', 'is_correct' => false, 'option_letter' => 'D']
                    ]
                ],
                [
                    'question' => 'If you have 50 apples and give away 18, how many are left?',
                    'variants' => [
                        ['text' => '32', 'is_correct' => true, 'option_letter' => 'A'],
                        ['text' => '68', 'is_correct' => false, 'option_letter' => 'B'],
                        ['text' => '30', 'is_correct' => false, 'option_letter' => 'C'],
                        ['text' => '38', 'is_correct' => false, 'option_letter' => 'D']
                    ]
                ]
            ],
            'Fractions and Decimals' => [
                [
                    'question' => 'What is 1/2 + 1/4?',
                    'variants' => [
                        ['text' => '3/4', 'is_correct' => true, 'option_letter' => 'A'],
                        ['text' => '2/6', 'is_correct' => false, 'option_letter' => 'B'],
                        ['text' => '1/3', 'is_correct' => false, 'option_letter' => 'C'],
                        ['text' => '2/4', 'is_correct' => false, 'option_letter' => 'D']
                    ]
                ],
                [
                    'question' => 'Convert 0.75 to a fraction:',
                    'variants' => [
                        ['text' => '3/4', 'is_correct' => true, 'option_letter' => 'A'],
                        ['text' => '7/5', 'is_correct' => false, 'option_letter' => 'B'],
                        ['text' => '75/10', 'is_correct' => false, 'option_letter' => 'C'],
                        ['text' => '3/5', 'is_correct' => false, 'option_letter' => 'D']
                    ]
                ]
            ],
            'Algebraic Expressions' => [
                [
                    'question' => 'Simplify: 3x + 2x - x',
                    'variants' => [
                        ['text' => '4x', 'is_correct' => true, 'option_letter' => 'A'],
                        ['text' => '6x', 'is_correct' => false, 'option_letter' => 'B'],
                        ['text' => '2x', 'is_correct' => false, 'option_letter' => 'C'],
                        ['text' => '5x', 'is_correct' => false, 'option_letter' => 'D']
                    ]
                ],
                [
                    'question' => 'If x = 5, what is 2x + 3?',
                    'variants' => [
                        ['text' => '13', 'is_correct' => true, 'option_letter' => 'A'],
                        ['text' => '10', 'is_correct' => false, 'option_letter' => 'B'],
                        ['text' => '8', 'is_correct' => false, 'option_letter' => 'C'],
                        ['text' => '15', 'is_correct' => false, 'option_letter' => 'D']
                    ]
                ]
            ],
            'Linear Equations' => [
                [
                    'question' => 'Solve for x: 2x + 5 = 13',
                    'variants' => [
                        ['text' => 'x = 4', 'is_correct' => true, 'option_letter' => 'A'],
                        ['text' => 'x = 3', 'is_correct' => false, 'option_letter' => 'B'],
                        ['text' => 'x = 5', 'is_correct' => false, 'option_letter' => 'C'],
                        ['text' => 'x = 6', 'is_correct' => false, 'option_letter' => 'D']
                    ]
                ]
            ],
            'Quadratic Functions' => [
                [
                    'question' => 'What is the vertex of y = x² - 4x + 3?',
                    'variants' => [
                        ['text' => '(2, -1)', 'is_correct' => true, 'option_letter' => 'A'],
                        ['text' => '(2, 1)', 'is_correct' => false, 'option_letter' => 'B'],
                        ['text' => '(-2, -1)', 'is_correct' => false, 'option_letter' => 'C'],
                        ['text' => '(0, 3)', 'is_correct' => false, 'option_letter' => 'D']
                    ]
                ]
            ],
            'Calculus Introduction' => [
                [
                    'question' => 'What is the derivative of x²?',
                    'variants' => [
                        ['text' => '2x', 'is_correct' => true, 'option_letter' => 'A'],
                        ['text' => 'x', 'is_correct' => false, 'option_letter' => 'B'],
                        ['text' => 'x²', 'is_correct' => false, 'option_letter' => 'C'],
                        ['text' => '2x²', 'is_correct' => false, 'option_letter' => 'D']
                    ]
                ]
            ]
        ];

        return $questions[$topicTitle] ?? [];
    }

    private function createSampleUserProgress(User $user, Subject $subject, array $topics)
    {
        // Create skill level for user
        $skillLevel = rand(1, 3);
        $levels = ['beginner', 'intermediate', 'advanced'];
        
        UserSkillLevel::create([
            'user_id' => $user->id,
            'subject_id' => $subject->id,
            'skill_level' => $levels[$skillLevel - 1],
            'assessment_score' => rand(60, 95),
            'last_assessed_at' => now()->subDays(rand(1, 30)),
            'needs_reassessment' => rand(0, 1) === 1
        ]);

        // Create progress for some topics based on skill level
        $topicsToComplete = rand(1, min($skillLevel + 2, count($topics)));
        
        for ($i = 0; $i < $topicsToComplete; $i++) {
            $topic = $topics[$i];
            $score = rand(50, 100);
            $attempts = rand(1, 5);
            
            $status = 'not_started';
            if ($score >= 90) {
                $status = 'mastered';
            } elseif ($score >= 70) {
                $status = 'completed';
            } elseif ($score >= 50) {
                $status = 'in_progress';
            }

            UserTopicProgress::create([
                'user_id' => $user->id,
                'topic_id' => $topic->id,
                'status' => $status,
                'best_score' => $score,
                'attempts' => $attempts,
                'correct_answers' => round(($score / 100) * 10 * $attempts),
                'total_questions_attempted' => 10 * $attempts,
                'weak_areas' => $score < 70 ? [rand(1, 5)] : [],
                'last_attempted_at' => now()->subDays(rand(1, 7)),
                'completed_at' => $status === 'completed' || $status === 'mastered' ? now()->subDays(rand(1, 7)) : null,
                'mastered_at' => $status === 'mastered' ? now()->subDays(rand(1, 7)) : null
            ]);
        }
    }
}