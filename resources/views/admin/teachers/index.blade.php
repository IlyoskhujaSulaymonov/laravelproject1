@extends('layouts.admin')

@section('content')
    <div class="container">
        <h1 class="mb-4">O‘qituvchilar ro‘yxati</h1>

        @if (session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        <a href="{{ route('admin.teachers.create') }}" class="btn btn-primary mb-3">+ O‘qituvchi qo‘shish</a>

        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Ism</th>
                    <th>Email</th>
                    <th>Telefon nomer</th>
                    <th>Amallar</th>
                </tr>
            </thead>
            <tbody>
                @forelse($teachers as $teacher)
                    <tr>
                        <td>{{ $teacher->id }}</td>
                        <td>{{ $teacher->name }}</td>
                        <td>{{ $teacher->email }}</td>
                        <td>{{ $teacher->phone }}</td>
                        <td>
                            <a href="{{ route('admin.teachers.edit', $teacher) }}"
                                class="btn btn-warning btn-sm">Tahrirlash</a>
                            <form action="{{ route('admin.teachers.destroy', $teacher) }}" method="POST"
                                style="display:inline-block;">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-sm"
                                    onclick="return confirm('Haqiqatan ham o‘chirmoqchimisiz?')">O‘chirish</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6">O‘qituvchilar mavjud emas</td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        {{ $teachers->links() }}
    </div>
@endsection
