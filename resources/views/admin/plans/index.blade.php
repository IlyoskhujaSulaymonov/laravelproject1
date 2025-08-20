@extends('layouts.admin')
@section('page-title', 'Tariflar')

@section('content')
<div class="container py-4">

    <a href="{{ route('admin.plans.create') }}" class="btn btn-primary mb-3">+ Yangi qo'shish</a>

    @if (session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>#</th>
                <th>Nomi</th>
                <th>Narxi (so'm)</th>
                <th>Muddati</th>
                <th>Testlar cheklovi</th>
                <th>Darslar cheklovi</th>
                <th>AI maslahatlar cheklovi</th>
                <th>Xususiyatlar</th>
                <th>Amallar</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($plans as $plan)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $plan->name }}</td>
                    <td>{{ $plan->price }}</td>
                    <td>@if($plan->duration) {{ $plan->duration }} days @else cheksiz @endif</td>
                    <td>{{ $plan->assessments_limit }}</td>
                     <td>{{ $plan->lessons_limit }}</td>
                      <td>{{ $plan->ai_hints_limit }}</td>
                    <td>
                        @if($plan->features)
                            <ul>
                                @foreach($plan->features as $feature)
                                    <li>{{ $feature }}</li>
                                @endforeach
                            </ul>
                        @endif
                    </td>
                    <td>
                        <a href="{{ route('admin.plans.edit', $plan) }}" class="btn btn-sm btn-warning">Tahrirlash</a>
                        <form action="{{ route('admin.plans.destroy', $plan) }}" method="POST" class="d-inline" onsubmit="return confirm('O‘chirishga ishonchingiz komilmi?')">
                            @csrf
                            @method('DELETE')
                            <button class="btn btn-sm btn-danger">O‘chirish</button>
                        </form>
                    </td>
                </tr>
            @empty
                <tr><td colspan="3">Hozircha sinflar mavjud emas.</td></tr>
            @endforelse
        </tbody>
    </table>

    {{ $plans->links() }}
</div>
@endsection
