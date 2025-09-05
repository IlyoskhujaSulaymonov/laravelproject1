<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    protected $fillable = ['question_id', 'text', 'is_correct','option_letter','formulas'];

    protected $casts = [
        'formulas' => 'array',
        'is_correct' => 'boolean',
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * Safely process formulas data from various formats
     */
    protected function processFormulas($formulas): array
    {
        // If null or empty, return empty array
        if (empty($formulas)) {
            return [];
        }
        
        // If already an array, return as is
        if (is_array($formulas)) {
            return $formulas;
        }
        
        // If string, try to decode JSON
        if (is_string($formulas)) {
            try {
                $decoded = json_decode($formulas, true);
                return is_array($decoded) ? $decoded : [];
            } catch (Exception $e) {
                // If JSON decode fails, return empty array
                return [];
            }
        }
        
        // For any other type, return empty array
        return [];
    }

    /**
     * Get the variant text with properly rendered mathematical formulas
     */
    public function getRenderedTextAttribute(): string
    {
        $text = $this->text;
        
        // Process formulas safely
        $formulas = $this->processFormulas($this->formulas);
        
        // If formulas array exists and is valid, replace placeholders with actual LaTeX
        if (!empty($formulas)) {
            foreach ($formulas as $index => $formula) {
                // Ensure formula is a string
                if (is_string($formula)) {
                    // Replace formula placeholders like {formula_0} with LaTeX syntax
                    $text = str_replace(
                        ['{formula_' . $index . '}', '{{formula_' . $index . '}}'],
                        '$' . $formula . '$',
                        $text
                    );
                } elseif (is_array($formula)) {
                    // Handle formula as object with various properties
                    $formulaContent = $formula['content'] ?? $formula['latex'] ?? $formula['text'] ?? '';
                    if (is_string($formulaContent)) {
                        $text = str_replace(
                            ['{formula_' . $index . '}', '{{formula_' . $index . '}}'],
                            '$' . $formulaContent . '$',
                            $text
                        );
                    }
                }
            }
        }
        
        return $text;
    }
}
