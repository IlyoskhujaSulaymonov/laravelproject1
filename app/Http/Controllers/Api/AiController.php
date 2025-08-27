<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AiController extends Controller
{
    protected $aiService;

    public function __construct(AiService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Explain mathematical problems and solutions using AI
     */
    public function explainMath(Request $request)
    {
        try {
            $request->validate([
                'problem' => 'required|string|max:1000',
                'steps' => 'nullable|array',
                'steps.*.tex' => 'string',
                'steps.*.note' => 'string',
                'language' => 'string|in:uz,en,ru|nullable'
            ]);

            // Check AI usage limit before proceeding
            $user = $request->user();
            $userPlan = $user->userPlan;
            
            if (!$userPlan) {
                return response()->json([
                    'success' => false,
                    'error' => 'Reja topilmadi. Iltimos, rejangizni tekshiring.'
                ], 403);
            }

            if (!$userPlan->canUseAIHint()) {
                return response()->json([
                    'success' => false,
                    'error' => 'AI tushuntirish limiti tugadi. Rejangizni yangilang yoki keyingi oyni kuting.',
                    'remaining' => 0,
                    'limit' => $userPlan->plan->ai_hints_limit ?? 0
                ], 429);
            }

            if (!$this->aiService->isAvailable()) {
                return response()->json([
                    'success' => false,
                    'error' => 'AI xizmati sozlanmagan',
                    'explanation' => $this->getFallbackExplanation($request->input('language', 'uz'))
                ], 503);
            }

            $problem = $request->input('problem');
            $steps = $request->input('steps', []);
            $language = $request->input('language', 'uz');

            // Get AI explanation
            $explanation = $this->aiService->getMathExplanation($problem, $steps, $language);

            // Increment usage counter after successful AI response
            $userPlan->useAIHint();

            return response()->json([
                'success' => true,
                'explanation' => $explanation,
                'problem' => $problem,
                'service' => $this->aiService->getCurrentService(),
                'remaining' => $userPlan->getRemainingAIHints()
            ]);

        } catch (\Exception $e) {
            Log::error('AI Math Explanation Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'AI xizmatida xatolik yuz berdi',
                'explanation' => $this->getFallbackExplanation($request->input('language', 'uz'))
            ], 500);
        }
    }

    /**
     * Generate step-by-step solutions using AI
     */
    public function solveProblem(Request $request)
    {
        try {
            $request->validate([
                'problem' => 'required|string|max:1000',
                'type' => 'string|in:equation,derivative,integral,simplify,evaluate,auto|nullable',
                'language' => 'string|in:uz,en,ru|nullable'
            ]);

            // Check AI usage limit before proceeding
            $user = $request->user();
            $userPlan = $user->userPlan;
            
            if (!$userPlan) {
                return response()->json([
                    'success' => false,
                    'error' => 'Reja topilmadi. Iltimos, rejangizni tekshiring.'
                ], 403);
            }

            if (!$userPlan->canUseAIHint()) {
                return response()->json([
                    'success' => false,
                    'error' => 'AI yechim limiti tugadi. Rejangizni yangilang yoki keyingi oyni kuting.',
                    'remaining' => 0,
                    'limit' => $userPlan->plan->ai_hints_limit ?? 0
                ], 429);
            }

            if (!$this->aiService->isAvailable()) {
                return response()->json([
                    'success' => false,
                    'error' => 'AI xizmati sozlanmagan',
                    'solution' => null
                ], 503);
            }

            $problem = $request->input('problem');
            $type = $request->input('type', 'auto');
            $language = $request->input('language', 'uz');

            // Get AI solution
            $solution = $this->aiService->solveMathProblem($problem, $type, $language);

            // Increment usage counter after successful AI response
            $userPlan->useAIHint();

            return response()->json([
                'success' => true,
                'solution' => $solution,
                'problem' => $problem,
                'type' => $type,
                'service' => $this->aiService->getCurrentService(),
                'remaining' => $userPlan->getRemainingAIHints()
            ]);

        } catch (\Exception $e) {
            Log::error('AI Problem Solving Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'AI xizmatida xatolik yuz berdi',
                'solution' => null
            ], 500);
        }
    }

    /**
     * Get mathematical hints and guidance using AI
     */
    public function getHint(Request $request)
    {
        try {
            $request->validate([
                'problem' => 'required|string|max:1000',
                'current_step' => 'string|nullable',
                'language' => 'string|in:uz,en,ru|nullable'
            ]);

            // Check AI usage limit before proceeding
            $user = $request->user();
            $userPlan = $user->userPlan;
            
            if (!$userPlan) {
                return response()->json([
                    'success' => false,
                    'error' => 'Reja topilmadi. Iltimos, rejangizni tekshiring.'
                ], 403);
            }

            if (!$userPlan->canUseAIHint()) {
                return response()->json([
                    'success' => false,
                    'error' => 'AI maslahat limiti tugadi. Rejangizni yangilang yoki keyingi oyni kuting.',
                    'remaining' => 0,
                    'limit' => $userPlan->plan->ai_hints_limit ?? 0
                ], 429);
            }

            if (!$this->aiService->isAvailable()) {
                return response()->json([
                    'success' => false,
                    'error' => 'AI xizmati sozlanmagan',
                    'hint' => $this->getFallbackHint($request->input('language', 'uz'))
                ], 503);
            }

            $problem = $request->input('problem');
            $currentStep = $request->input('current_step', '');
            $language = $request->input('language', 'uz');

            // Get AI hint
            $hint = $this->aiService->getMathHint($problem, $currentStep, $language);

            // Increment usage counter after successful AI response
            $userPlan->useAIHint();

            return response()->json([
                'success' => true,
                'hint' => $hint,
                'problem' => $problem,
                'service' => $this->aiService->getCurrentService(),
                'remaining' => $userPlan->getRemainingAIHints()
            ]);

        } catch (\Exception $e) {
            Log::error('AI Hint Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'AI xizmatida xatolik yuz berdi',
                'hint' => $this->getFallbackHint($request->input('language', 'uz'))
            ], 500);
        }
    }

    /**
     * Get AI service status
     */
    public function status()
    {
        return response()->json([
            'available' => $this->aiService->isAvailable(),
            'service' => $this->aiService->getCurrentService(),
            'timestamp' => now()->toISOString()
        ]);
    }

    /**
     * Fallback explanation when AI is not available
     */
    private function getFallbackExplanation($language = 'uz')
    {
        $fallbacks = [
            'uz' => 'AI xizmati hozirda mavjud emas. Matematik masalalarni qadam-baqadam yechish uchun qoidalarga amal qiling va formulalarni to\'g\'ri qo\'llang.',
            'en' => 'AI service is currently unavailable. Follow mathematical rules and apply formulas correctly for step-by-step problem solving.',
            'ru' => 'Сервис ИИ в настоящее время недоступен. Следуйте математическим правилам и правильно применяйте формулы для пошагового решения задач.'
        ];

        return $fallbacks[$language] ?? $fallbacks['uz'];
    }

    /**
     * Fallback hint when AI is not available
     */
    private function getFallbackHint($language = 'uz')
    {
        $fallbacks = [
            'uz' => 'Masalani yechishda formulalarni eslang va qadma-qadam harakat qiling.',
            'en' => 'Remember the formulas and work step by step when solving the problem.',
            'ru' => 'Помните формулы и работайте пошагово при решении задачи.'
        ];

        return $fallbacks[$language] ?? $fallbacks['uz'];
    }
}