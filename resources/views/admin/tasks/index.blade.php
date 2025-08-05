@extends('layouts.admin')
@section('title', 'Vazifalar')

@section('content')
<div class="container py-4">
    <h2>Vazifalar</h2>

    <a href="{{ route('admin.tasks.create') }}" class="btn btn-primary mb-3">+ Yangi vazifa</a>

    @if (session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>#</th>
                <th>Sarlavha</th>
                <th>Sana</th>
                <th>Amallar</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($tasks as $task)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $task->title }}</td>
                    <td>{{ $task->due_date }}</td>
                    <td>
                        <a href="{{ route('admin.tasks.edit', $task) }}" class="btn btn-sm btn-warning">Tahrirlash</a>
                        <form action="{{ route('admin.tasks.destroy', $task) }}" method="POST" class="d-inline" onsubmit="return confirm('O‘chirishga ishonchingiz komilmi?')">
                            @csrf
                            @method('DELETE')
                            <button class="btn btn-sm btn-danger">O‘chirish</button>
                        </form>
                    </td>
                </tr>
            @empty
                <tr><td colspan="4">Hozircha vazifalar yo‘q.</td></tr>
            @endforelse
        </tbody>
    </table>

    {{ $tasks->links() }}
</div>
@endsection
