@extends('layouts.admin')

@section('title', 'Fanlar')

@section('content')
<div class="container py-4">
    <h2 class="mb-4">Fanlar</h2>

    <a href="{{ route('admin.subjects.create') }}" class="btn btn-primary mb-3">+ Fan qo‘shish</a>

    @if (session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Nomi</th>
                <th>Kodi</th>
                <th>Izoh</th>
                <th>Amallar</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($subjects as $subject)
                <tr>
                    <td>{{ $subject->name }}</td>
                    <td>{{ $subject->code }}</td>
                    <td>{{ $subject->description }}</td>
                    <td>
                        <a href="{{ route('admin.subjects.edit', $subject) }}" class="btn btn-sm btn-warning">Tahrirlash</a>
                        <form action="{{ route('admin.subjects.destroy', $subject) }}" method="POST" class="d-inline" onsubmit="return confirm('Ishonchingiz komilmi?')">
                            @csrf
                            @method('DELETE')
                            <button class="btn btn-sm btn-danger">O‘chirish</button>
                        </form>
                    </td>
                </tr>
            @empty
                <tr><td colspan="4">Fanlar mavjud emas.</td></tr>
            @endforelse
        </tbody>
    </table>

    {{ $subjects->links() }}
</div>
@endsection
