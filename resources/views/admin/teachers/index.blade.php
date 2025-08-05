@extends('layouts.admin')

@section('content')
<div class="container">
    <h1>O'qituvchilar</h1>
    <a href="{{ route('admin.teachers.create') }}" class="btn btn-primary mb-3">Yangi O'qituvchi</a>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Ism</th>
                <th>Familiya</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Amallar</th>
            </tr>
        </thead>
        <tbody>
            @foreach($teachers as $teacher)
                <tr>
                    <td>{{ $teacher->first_name }}</td>
                    <td>{{ $teacher->last_name }}</td>
                    <td>{{ $teacher->email }}</td>
                    <td>{{ $teacher->phone }}</td>
                    <td>
                        <a href="{{ route('admin.teachers.show', $teacher) }}" class="btn btn-info btn-sm">Ko'rish</a>
                        <a href="{{ route('admin.teachers.edit', $teacher) }}" class="btn btn-warning btn-sm">Tahrirlash</a>
                        <form action="{{ route('admin.teachers.destroy', $teacher) }}" method="POST" style="display:inline;">
                            @csrf @method('DELETE')
                            <button class="btn btn-danger btn-sm" onclick="return confirm('Ishonchingiz komilmi?')">O'chirish</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{ $teachers->links() }}
</div>
@endsection
