<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\UserTest;
use App\Models\User;
use App\Models\Topic;

class UserTestsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get a sample user and topics
        $user = User::where('role', User::ROLE_USER)->first();
        $topics = Topic::limit(5)->get();

        if ($user && $topics->count() > 0) {
            // Create sample test results
            foreach ($topics as $index => $topic) {
                UserTest::create([
                    'user_id' => $user->id,
                    'topic_id' => $topic->id,
                    'test_name' => $topic->title . ' - Test ' . ($index + 1),
                    'total_questions' => 10,
                    'correct_answers' => rand(6, 10),
                    'score_percentage' => rand(60, 100),
                    'time_spent' => rand(300, 900), // 5-15 minutes
                    'questions_data' => [
                        'sample_question_1' => ['answered' => true, 'correct' => true],
                        'sample_question_2' => ['answered' => true, 'correct' => false],
                    ],
                    'status' => 'completed'
                ]);
            }
        }
    }
}
