<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiService
{
    protected $config;
    
    public function __construct()
    {
        $this->config = config('ai');
    }

    /**
     * Get mathematical explanation from AI
     */
    public function getMathExplanation(string $problem, array $steps = [], string $language = 'uz'): string
    {
        $prompt = $this->buildMathExplanationPrompt($problem, $steps, $language);
        return $this->getAiResponse($prompt);
    }

    /**
     * Get mathematical solution from AI
     */
    public function solveMathProblem(string $problem, string $type = 'auto', string $language = 'uz'): string
    {
        $prompt = $this->buildProblemSolvingPrompt($problem, $type, $language);
        return $this->getAiResponse($prompt);
    }

    /**
     * Get mathematical hint from AI
     */
    public function getMathHint(string $problem, string $currentStep = '', string $language = 'uz'): string
    {
        $prompt = $this->buildHintPrompt($problem, $currentStep, $language);
        return $this->getAiResponse($prompt);
    }

    /**
     * Get AI response based on configured service
     */
    protected function getAiResponse(string $prompt): string
    {
        $service = $this->config['default_service'] ?? 'openai';

        try {
            switch ($service) {
                case 'openai':
                    return $this->getOpenAiResponse($prompt);
                case 'anthropic':
                    return $this->getAnthropicResponse($prompt);
                case 'gemini':
                    return $this->getGeminiResponse($prompt);
                default:
                    throw new \Exception("Unsupported AI service: {$service}");
            }
        } catch (\Exception $e) {
            Log::error("AI Service Error ({$service}): " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * OpenAI API integration
     */
    protected function getOpenAiResponse(string $prompt): string
    {
        $apiKey = $this->config['openai']['api_key'];
        $model = $this->config['openai']['model'] ?? 'gpt-3.5-turbo';

        if (!$apiKey) {
            throw new \Exception('OpenAI API key not configured');
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ])
        ->timeout($this->config['settings']['timeout'] ?? 30)
        ->post('https://api.openai.com/v1/chat/completions', [
            'model' => $model,
            'messages' => [
                [
                    'role' => 'system', 
                    'content' => 'Siz matematik masalalarni yechishda yordam beradigan AI yordamchisiz. Aniq, qisqa va tushunarli javob bering.'
                ],
                ['role' => 'user', 'content' => $prompt]
            ],
            'max_tokens' => $this->config['settings']['max_tokens'] ?? 500,
            'temperature' => $this->config['settings']['temperature'] ?? 0.7,
        ]);

        if ($response->successful()) {
            $data = $response->json();
            return $data['choices'][0]['message']['content'] ?? 'AI javob bermadi';
        }

        throw new \Exception('OpenAI API error: ' . $response->status());
    }

    /**
     * Anthropic Claude API integration
     */
    protected function getAnthropicResponse(string $prompt): string
    {
        $apiKey = $this->config['anthropic']['api_key'];
        $model = $this->config['anthropic']['model'] ?? 'claude-3-haiku-20240307';

        if (!$apiKey) {
            throw new \Exception('Anthropic API key not configured');
        }

        $response = Http::withHeaders([
            'x-api-key' => $apiKey,
            'Content-Type' => 'application/json',
            'anthropic-version' => '2023-06-01',
        ])
        ->timeout($this->config['settings']['timeout'] ?? 30)
        ->post('https://api.anthropic.com/v1/messages', [
            'model' => $model,
            'max_tokens' => $this->config['settings']['max_tokens'] ?? 500,
            'messages' => [
                ['role' => 'user', 'content' => $prompt]
            ],
        ]);

        if ($response->successful()) {
            $data = $response->json();
            return $data['content'][0]['text'] ?? 'AI javob bermadi';
        }

        throw new \Exception('Anthropic API error: ' . $response->status());
    }

    /**
     * Google Gemini API integration
     */
    protected function getGeminiResponse(string $prompt): string
    {
        $apiKey = $this->config['gemini']['api_key'];
        $model = $this->config['gemini']['model'] ?? 'gemini-1.5-flash';

        if (!$apiKey) {
            throw new \Exception('Gemini API key not configured');
        }

        // Use the current v1 API (not v1beta)
        $response = Http::timeout($this->config['settings']['timeout'] ?? 30)
            ->post("https://generativelanguage.googleapis.com/v1/models/{$model}:generateContent?key={$apiKey}", [
                'contents' => [
                    ['parts' => [['text' => $prompt]]]
                ],
                'generationConfig' => [
                    'maxOutputTokens' => $this->config['settings']['max_tokens'] ?? 1000,
                    'temperature' => $this->config['settings']['temperature'] ?? 0.7,
                    'topP' => 0.8,
                    'topK' => 40,
                ],
                'safetySettings' => [
                    [
                        'category' => 'HARM_CATEGORY_HARASSMENT',
                        'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                    ],
                    [
                        'category' => 'HARM_CATEGORY_HATE_SPEECH', 
                        'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                    ],
                    [
                        'category' => 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                        'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                    ],
                    [
                        'category' => 'HARM_CATEGORY_DANGEROUS_CONTENT',
                        'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                    ]
                ]
            ]);

        if ($response->successful()) {
            $data = $response->json();
            
            // Handle Gemini's response structure
            if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                return $data['candidates'][0]['content']['parts'][0]['text'];
            }
            
            // Handle case where response is blocked by safety filters
            if (isset($data['candidates'][0]['finishReason']) && $data['candidates'][0]['finishReason'] === 'SAFETY') {
                return 'Bu savol xavfsizlik filtrlari tomonidan bloklandi. Iltimos, boshqa usulda so\'rang.';
            }
            
            // Handle other finish reasons
            if (isset($data['candidates'][0]['finishReason'])) {
                $reason = $data['candidates'][0]['finishReason'];
                return "Javob to'liq emas (sabab: {$reason}). Iltimos, savolni qisqaroq qilib so'rang.";
            }
            
            return 'AI javob bermadi';
        }

        // Handle specific Gemini error codes
        $errorData = $response->json();
        if (isset($errorData['error']['code'])) {
            $code = $errorData['error']['code'];
            $message = $errorData['error']['message'] ?? 'Unknown error';
            
            switch ($code) {
                case 400:
                    throw new \Exception("So'rov noto'g'ri formatda: {$message}");
                case 403:
                    throw new \Exception('API kaliti noto\'g\'ri yoki ruxsat yo\'q');
                case 404:
                    throw new \Exception("Model topilmadi. Iltimos, GEMINI_MODEL ni tekshiring: {$message}");
                case 429:
                    throw new \Exception('So\'rovlar soni chegarasi oshib ketdi');
                case 500:
                    throw new \Exception('Gemini serverida xatolik');
                default:
                    throw new \Exception("Gemini API xatolik ({$code}): {$message}");
            }
        }

        throw new \Exception('Gemini API error: ' . $response->status());
    }

    /**
     * Build prompt for mathematical explanation
     */
    protected function buildMathExplanationPrompt(string $problem, array $steps, string $language): string
    {
        $langInstructions = [
            'uz' => 'O\'zbek tilida tushuntiring',
            'en' => 'Explain in English',
            'ru' => 'Объясните на русском языке'
        ];

        $instruction = $langInstructions[$language] ?? $langInstructions['uz'];

        $stepsText = '';
        if (!empty($steps)) {
            $stepsText = "\n\nYechim qadamlari:\n";
            foreach ($steps as $index => $step) {
                $stepsText .= ($index + 1) . ". " . ($step['note'] ?? '') . "\n";
            }
        }

        // Optimized prompt for Gemini
        return "Siz matematik masalalarni tushuntiradigan o'qituvchisiz.

MATEMATIK MASALA: {$problem}{$stepsText}

VAZIFA: {$instruction}. Bu masalani qanday yechish kerakligi haqida:
1. Oddiy va tushunarli tarzda tushuntiring
2. Talabalar uchun foydali maslahatlar bering
3. Agar yechim qadamlari berilgan bo'lsa, ularni tushuntiring
4. Matematik terminlarni sodda tilda izohlang

JAVOB UZUNLIGI: Maksimal 200 so'z
JAVOB TILI: {$language}
JAVOB USLUBI: Do'stona va ta'limiy";
    }

    /**
     * Build prompt for problem solving
     */
    protected function buildProblemSolvingPrompt(string $problem, string $type, string $language): string
    {
        $langInstructions = [
            'uz' => 'O\'zbek tilida qadam-baqadam yechim bering',
            'en' => 'Provide step-by-step solution in English',
            'ru' => 'Предоставьте пошаговое решение на русском языке'
        ];

        $instruction = $langInstructions[$language] ?? $langInstructions['uz'];

        // Enhanced prompt for Gemini with better structure
        return "Siz tajribali matematik o'qituvchisiz.

MATEMATIK MASALA: {$problem}
MASALA TURI: {$type}

VAZIFA: {$instruction}.

YECHIM FORMATI:
1. Masalani tahlil qiling
2. Har bir qadamni aniq ko'rsating
3. Matematik amallarni tushuntiring
4. Yakuniy javobni bering

TALABLAR:
- Har bir qadamni alohida qatorda yozing
- Matematik formulalarni to'g'ri ishlating
- Hisob-kitoblarni aniq ko'rsating
- Sodda va tushunarli tilda yozing

JAVOB UZUNLIGI: Maksimal 300 so'z
JAVOB TILI: {$language}";
    }

    /**
     * Build prompt for hints
     */
    protected function buildHintPrompt(string $problem, string $currentStep, string $language): string
    {
        $langInstructions = [
            'uz' => 'O\'zbek tilida maslahat bering',
            'en' => 'Give advice in English',
            'ru' => 'Дайте совет на русском языке'
        ];

        $instruction = $langInstructions[$language] ?? $langInstructions['uz'];

        $stepInfo = $currentStep ? "\nHozirgi qadam: {$currentStep}" : "";

        return "Matematik masala: {$problem}{$stepInfo}

{$instruction}. Talabaga keyingi qadamni qanday boshlash kerakligi haqida qisqa va foydali maslahat bering.
Javobni to'g'ridan-to'g'ri aytmang, faqat yo'nalish ko'rsating.
50 so'zdan oshmasin.";
    }

    /**
     * Check if AI service is available
     */
    public function isAvailable(): bool
    {
        $service = $this->config['default_service'] ?? 'openai';
        
        switch ($service) {
            case 'openai':
                return !empty($this->config['openai']['api_key']);
            case 'anthropic':
                return !empty($this->config['anthropic']['api_key']);
            case 'gemini':
                return !empty($this->config['gemini']['api_key']);
            default:
                return false;
        }
    }

    /**
     * Get current AI service name
     */
    public function getCurrentService(): string
    {
        return $this->config['default_service'] ?? 'none';
    }
}