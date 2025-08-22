<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // users table
            'name'  => ['required', 'string', 'max:255'],
            'email' => [
                'required', 'string', 'lowercase', 'email', 'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'phone' => ['nullable', 'string', 'max:20'],

            // user_data table
            'region_id'      => ['nullable', 'integer'],
            'date_of_birth'  => ['nullable', 'date'],
            'occupation'     => ['nullable', 'string', 'max:255'],
            'education_level'=> ['nullable', 'string', 'max:255'],
            'current_grade'  => ['nullable', 'string', 'max:255'],
            'subjects'       => ['nullable', 'array'],
            'subjects.*'     => ['string', 'max:255'], // Validate each subject item
            'goals'          => ['nullable', 'array'],
            'goals.*'        => ['string', 'max:255'], // Validate each goal item
             'avatar'         => ['nullable', 'image', 'max:2048'],
        ];
    }
}
