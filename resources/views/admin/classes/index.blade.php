@extends('layouts.admin')
@section('title', 'Sinflar')

@section('content')
<div class="container py-4">
    <h2>Sinflar</h2>

    <a href="{{ route('admin.classes.create') }}" class="btn btn-primary mb-3">+ Yangi sinf</a>

    @if (session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>#</th>
                <th>Nomi</th>
                <th>Amallar</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($classes as $class)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $class->name }}</td>
                    <td>
                        <a href="{{ route('admin.classes.edit', $class) }}" class="btn btn-sm btn-warning">Tahrirlash</a>
                        <form action="{{ route('admin.classes.destroy', $class) }}" method="POST" class="d-inline" onsubmit="return confirm('O‘chirishga ishonchingiz komilmi?')">
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

    {{ $classes->links() }}
</div>
@endsection
