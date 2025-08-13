@extends('layouts.admin')

@section('page-title', $topic->title . ' - Mavzusidan savollar ro\'yxati')

{{-- Enhanced Custom Styles --}}
<style>
    /* Enhanced shadow styling for question text */
    .enhanced-shadow {
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
        font-weight: 500;
        font-size: 1.1rem;
    }
    
    .enhanced-shadow:hover {
        text-shadow: 0 3px 6px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease-in-out;
    }
    
    /* Improved inline content display */
    .math-preview.inline-content {
        line-height: 1.7;
        max-height: 5.1em;
        overflow: hidden;
        position: relative;
        display: inline;
    }
    
    .math-preview.inline-content * {
        display: inline !important;
        margin: 0 !important;
        padding: 0 3px !important;
        line-height: inherit !important;
    }
    
    .math-preview.inline-content br {
        display: none !important;
    }
    
    .math-preview.inline-content p,
    .math-preview.inline-content div {
        display: inline !important;
        margin: 0 !important;
    }
    
    .math-preview {
        line-height: 1.7;
        max-height: 5.1em;
        overflow: hidden;
        position: relative;
    }
    
    .math-preview.expanded {
        max-height: none;
    }
    
    .math-preview::after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 1.7em;
        pointer-events: none;
    }
    
    .math-preview.expanded::after {
        display: none;
    }
    
    .expand-btn {
        margin-top: 0.75rem;
        font-size: 0.875rem;
        color: #3b82f6;
        cursor: pointer;
        border: none;
        background: none;
        padding: 0.25rem 0.5rem;
        border-radius: 0.5rem;
        font-weight: 500;
        transition: all 0.2s ease-in-out;
    }
    
    .expand-btn:hover {
        color: #1d4ed8;
        background-color: #eff6ff;
        transform: translateY(-1px);
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 8px;
    }
    
    ::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
    }
</style>


@section('content')
<div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8">
    <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-8 mb-8 backdrop-blur-sm">
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div class="space-y-2">
                    <h1 class="text-3xl font-bold text-slate-900 tracking-tight">{{ $topic->title }}</h1>
                    <div class="flex items-center gap-4 text-slate-600">
                        <span class="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {{ $questions->total() }} ta savol
                        </span>
                    </div>
                </div>
                <div class="flex gap-3">
                    <a href="{{ route('admin.questions.topic.list') }}" 
                       class="inline-flex items-center px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                        </svg>
                        Ortga
                    </a>
                    <a href="{{ route('admin.questions.create', $topic) }}" 
                       class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Yangi savol qo'shish
                    </a>
                </div>
            </div>
        </div>

        <!-- Search and Filter Section -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6 mb-8">
            <form method="GET" class="flex flex-col sm:flex-row gap-4">
                <div class="flex-1 relative">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <input type="text" 
                           name="search" 
                           value="{{ request('search') }}"
                           placeholder="Savollarni qidirish..." 
                           class="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all duration-200">
                </div>
                <div class="flex gap-3">
                    <button type="submit" 
                            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                        <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        Qidirish
                    </button>
                    @if(request('search'))
                        <a href="{{ route('admin.questions.index', $topic) }}" 
                           class="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                            <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                            Tozalash
                        </a>
                    @endif
                </div>
            </form>
        </div>

        <!-- Questions Grid -->
        <div class="space-y-6">
            @php
                $offset = (request()->get('page', 1) - 1) * $questions->perPage();
            @endphp
            
            @forelse($questions as $question)
                <div class="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
                    <div class="p-8">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <!-- Question Number and Topic -->
                                <div class="flex items-center gap-4 mb-4">
                                    <span class="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-bold shadow-lg">
                                        {{ $offset + $loop->iteration }}
                                    </span>
                                    <span class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-full text-sm font-medium shadow-sm">
                                        {{ $question->topic->title ?? 'Noma\'lum' }}
                                    </span>
                                </div>
                                
                                <!-- Question Content -->
                                <div class="math-preview text-slate-800 mb-6 inline-content enhanced-shadow leading-relaxed" data-full-content="{!! htmlspecialchars($question->question) !!}">
                                    {!! $question->question !!}
                                </div>
                                
                                <!-- Question Stats -->
                                <div class="flex items-center gap-8 text-sm text-slate-500">
                                    <span class="flex items-center gap-2 font-medium">
                                        <svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                                        </svg>
                                        {{ $question->variants->count() }} ta variant
                                    </span>
                                    <span class="flex items-center gap-2 font-medium">
                                        <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                        </svg>
                                        {{ $question->variants->where('is_correct', true)->count() }} ta to'g'ri javob
                                    </span>
                                    <span class="flex items-center gap-2 font-medium">
                                        <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                                        </svg>
                                        {{ $question->created_at->format('d.m.Y') }}
                                    </span>
                                </div>
                            </div>
                            
                            <!-- Actions -->
                            <div class="flex items-center gap-2 ml-6">
                                <a href="{{ route('admin.questions.show', [$topic, $question]) }}" 
                                   class="inline-flex items-center justify-center w-10 h-10 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group-hover:scale-105"
                                   title="Ko'rish">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                    </svg>
                                </a>
                                <a href="{{ route('admin.questions.edit', [$topic, $question]) }}" 
                                   class="inline-flex items-center justify-center w-10 h-10 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group-hover:scale-105"
                                   title="Tahrirlash">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                    </svg>
                                </a>
                                <form action="{{ route('admin.questions.destroy', [$topic, $question]) }}" 
                                      method="POST" 
                                      class="inline-block"
                                      onsubmit="return confirm('Bu savolni o\'chirishni istaysizmi?')">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" 
                                            class="inline-flex items-center justify-center w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group-hover:scale-105"
                                            title="O'chirish">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            @empty
                <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-16 text-center">
                    <div class="max-w-md mx-auto">
                        <div class="w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 mb-3">Savollar topilmadi</h3>
                        <p class="text-slate-600 mb-8 leading-relaxed">
                            @if(request('search'))
                                "{{ request('search') }}" bo'yicha qidiruv natijasi topilmadi.
                            @else
                                Hozircha bu mavzuda savollar mavjud emas.
                            @endif
                        </p>
                        <a href="{{ route('admin.questions.create', $topic) }}" 
                           class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                            </svg>
                            Birinchi savolni qo'shish
                        </a>
                    </div>
                </div>
            @endforelse
        </div>

        <!-- Pagination -->
        @if($questions->hasPages())
            <div class="mt-12 flex justify-center">
                <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6">
                    {{ $questions->appends(request()->query())->links() }}
                </div>
            </div>
        @endif
    </div>
</div>

{{-- MathJax Configuration --}}
<script>
    window.MathJax = {
        tex: { 
            inlineMath: [['$', '$'], ['\$$', '\$$']], 
            displayMath: [['$$', '$$'], ['\\[', '\\]']]
        },
        svg: { 
            fontCache: 'global',
            scale: 0.95
        },
        startup: {
            ready: () => {
                MathJax.startup.defaultReady();
                initializeMathPreview();
            }
        }
    };

    function truncateMathSafe(html, limit = 180) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        
        if (plainText.length <= limit) {
            return html;
        }
        
        let truncated = '';
        let currentLength = 0;
        const walker = document.createTreeWalker(
            tempDiv,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            const remainingLength = limit - currentLength;
            if (remainingLength <= 0) break;
            
            if (node.textContent.length <= remainingLength) {
                currentLength += node.textContent.length;
            } else {
                node.textContent = node.textContent.substring(0, remainingLength) + '...';
                currentLength = limit;
                break;
            }
        }
        
        return tempDiv.innerHTML;
    }

    function initializeMathPreview() {
        document.querySelectorAll('.math-preview').forEach(el => {
            const fullContent = el.getAttribute('data-full-content');
            const truncatedContent = truncateMathSafe(fullContent, 180);
            
            if (fullContent !== truncatedContent) {
                el.innerHTML = truncatedContent;
                
                const expandBtn = document.createElement('button');
                expandBtn.className = 'expand-btn';
                expandBtn.textContent = 'Ko\'proq ko\'rish...';
                expandBtn.onclick = function() {
                    if (el.classList.contains('expanded')) {
                        el.innerHTML = truncatedContent;
                        el.classList.remove('expanded');
                        expandBtn.textContent = 'Ko\'proq ko\'rish...';
                    } else {
                        el.innerHTML = fullContent;
                        el.classList.add('expanded');
                        expandBtn.textContent = 'Kamroq ko\'rish';
                        MathJax.typesetPromise([el]);
                    }
                    el.appendChild(expandBtn);
                };
                el.appendChild(expandBtn);
            } else {
                el.innerHTML = fullContent;
            }
        });
        
        MathJax.typesetPromise();
    }

    document.addEventListener('DOMContentLoaded', function() {
        if (window.MathJax && window.MathJax.startup && window.MathJax.startup.document) {
            initializeMathPreview();
        }
    });
</script>

{{-- Load MathJax --}}
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>

@endsection
