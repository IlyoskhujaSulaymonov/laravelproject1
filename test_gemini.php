<?php

/**
 * Gemini AI Integration Test Script
 * 
 * This script tests if your Gemini API key and configuration are working correctly.
 * Run this from the command line: php test_gemini.php
 */

require_once 'vendor/autoload.php';

use Illuminate\Http\Client\Factory;
use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Get configuration
$apiKey = $_ENV['GEMINI_API_KEY'] ?? null;
$model = $_ENV['GEMINI_MODEL'] ?? 'gemini-1.5-flash';
$timeout = $_ENV['AI_TIMEOUT'] ?? 30;
$maxTokens = $_ENV['AI_MAX_TOKENS'] ?? 1000;

echo "🧪 Testing Gemini AI Integration\n";
echo "================================\n\n";

// Check if API key is configured
if (!$apiKey || $apiKey === '# Add your Gemini API key here') {
    echo "❌ Error: Gemini API key not configured!\n";
    echo "Please add your API key to the .env file:\n";
    echo "GEMINI_API_KEY=your_actual_api_key_here\n\n";
    echo "Get your API key from: https://aistudio.google.com/app/apikey\n";
    exit(1);
}

echo "✅ API Key: Configured (***" . substr($apiKey, -4) . ")\n";
echo "✅ Model: {$model}\n";
echo "✅ Timeout: {$timeout} seconds\n";
echo "✅ Max Tokens: {$maxTokens}\n\n";

// Test API connection
echo "🔗 Testing API connection...\n";

$http = new Factory();

$testPrompt = "2 + 2 = nechta? Qisqa javob bering.";

try {
    $response = $http->timeout($timeout)
        ->post("https://generativelanguage.googleapis.com/v1/models/{$model}:generateContent?key={$apiKey}", [
            'contents' => [
                ['parts' => [['text' => $testPrompt]]]
            ],
            'generationConfig' => [
                'maxOutputTokens' => 50,
                'temperature' => 0.7,
            ]
        ]);

    if ($response->successful()) {
        $data = $response->json();
        
        if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
            $aiResponse = $data['candidates'][0]['content']['parts'][0]['text'];
            echo "✅ Connection successful!\n";
            echo "📝 Test question: {$testPrompt}\n";
            echo "🤖 AI response: {$aiResponse}\n\n";
            
            echo "🎉 Gemini integration is working correctly!\n";
            echo "You can now use AI features in the Math Tutor.\n\n";
            
            // Additional info
            echo "💡 Tips for using Gemini:\n";
            echo "- Gemini Pro is free with rate limits\n";
            echo "- Great for mathematical explanations\n";
            echo "- Supports multiple languages including Uzbek\n";
            echo "- Cost-effective alternative to OpenAI\n\n";
            
        } else {
            echo "⚠️  API responded but no content received.\n";
            echo "Response: " . json_encode($data, JSON_PRETTY_PRINT) . "\n";
        }
        
    } else {
        $errorData = $response->json();
        echo "❌ API request failed!\n";
        echo "Status: " . $response->status() . "\n";
        echo "Error: " . json_encode($errorData, JSON_PRETTY_PRINT) . "\n\n";
        
        // Provide specific help based on error
        if ($response->status() === 403) {
            echo "💡 This looks like an API key issue. Please check:\n";
            echo "1. Your API key is correct\n";
            echo "2. Gemini API is enabled for your Google account\n";
            echo "3. You haven't exceeded your quota\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Connection failed: " . $e->getMessage() . "\n\n";
    
    if (strpos($e->getMessage(), 'timeout') !== false) {
        echo "💡 This looks like a timeout issue. Try:\n";
        echo "1. Checking your internet connection\n";
        echo "2. Increasing AI_TIMEOUT in .env\n";
    }
}

echo "\n📚 For more information, see: AI_INTEGRATION.md\n";