<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Question extends Model
{
    protected $fillable = ['topic_id', 'subject_id', 'question', 'formulas', 'images', 'type'];

    protected $casts = [
        'formulas' => 'array',
        'images' => 'array'
    ];

    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(Variant::class);
    }

    // Scope for regular questions (topic-based)
    public function scopeRegular($query)
    {
        return $query->where('type', 'regular')->whereNotNull('topic_id');
    }

    // Scope for sample questions (subject-based)
    public function scopeSample($query)
    {
        return $query->where('type', 'sample')->whereNotNull('subject_id');
    }

    // Check if this is a sample question
    public function isSample(): bool
    {
        return $this->type === 'sample';
    }

    // Check if this is a regular question
    public function isRegular(): bool
    {
        return $this->type === 'regular';
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
     * Get the question text with properly rendered mathematical formulas
     */
    public function getRenderedQuestionAttribute(): string
    {
        $text = $this->question;
        
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
