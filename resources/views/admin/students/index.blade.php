@extends('layouts.admin')

@section('title', 'Talabalar')

@section('content')
<div class="container py-4">
    <h2 class="mb-4">Talabalar</h2>

    <a href="{{ route('admin.students.create') }}" class="btn btn-primary mb-3">+ Talaba qo‘shish</a>

    @if (session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Ismi</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Amallar</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($students as $student)
                <tr>
                    <td>{{ $student->name }}</td>
                    <td>{{ $student->email }}</td>
                    <td>{{ $student->phone }}</td>
                    <td>
                        <a href="{{ route('admin.students.edit', $student) }}" class="btn btn-sm btn-warning">Tahrirlash</a>
                        <form action="{{ route('admin.students.destroy', $student) }}" method="POST" class="d-inline" onsubmit="return confirm('Ishonchingiz komilmi?')">
                            @csrf
                            @method('DELETE')
                            <button class="btn btn-sm btn-danger">O‘chirish</button>
                        </form>
                    </td>
                </tr>
            @empty
                <tr><td colspan="4">Talabalar mavjud emas.</td></tr>
            @endforelse
        </tbody>
    </table>

    {{ $students->links() }}
</div>
@endsection
