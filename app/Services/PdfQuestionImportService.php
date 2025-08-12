<?php

namespace App\Services;

use Smalot\PdfParser\Parser;
use Illuminate\Support\Facades\Http;
use App\Models\Question;
use App\Models\Variant;

class PdfQuestionImportService
{
    public function importFromPdf(string $pdfPath, int $topicId): array
    {
         // Step 1: Extract text from PDF
    $parser = new Parser();
    $pdf = $parser->parseFile($pdfPath);
    $text = $pdf->getText();

    // Clean text to avoid malformed UTF-8
    $text = mb_convert_encoding($text, 'UTF-8', 'UTF-8'); // normalize encoding
    $text = preg_replace('/[^\PC\s]/u', '', $text); // remove control chars

    // Step 2: Send to Ollama for parsing
    $prompt = "
You are a test parser. 
Extract all multiple-choice questions from the text below.
Return only JSON in this exact format:
[
  {
    \"question\": \"string\",
    \"format\": \"text|latex\",
    \"options\": [\"opt1\", \"opt2\", \"opt3\", \"opt4\"],
    \"correct\": 0
  }
]
Here is the PDF content:
---
{$text}
---
    ";

    dd($prompt); // Debugging line to check the prompt format
    $response = Http::timeout(300)
        ->post('http://127.0.0.1:11434/api/generate', [
            'model' => 'mistral',
            'prompt' => $prompt,
            'stream' => false
        ]);


        $jsonString = $response->json('response'); // Ollama returns it under 'response'
        $questions = json_decode($jsonString, true);
        dd($questions);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \Exception("Failed to parse JSON from Ollama response");
        }

        // Step 3: Save questions to DB
        foreach ($questions as $q) {
            \App\Models\Question::create([
                'topic_id' => $topicId,
                'question' => $q['question'],
                'format' => $q['format'],
                'options' => json_encode($q['options']),
                'correct' => $q['correct'],
            ]);
        }

        return $questions;
    }
}