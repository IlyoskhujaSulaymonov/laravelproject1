@extends('layouts.admin')

@section('content')
<div class="container">
    <h1 class="mb-4">Foydalanuvchilar ro'yxati</h1>

    <a href="{{ route('admin.users.create') }}" class="btn btn-primary mb-3">Yangi foydalanuvchi qo‘shish</a>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>#</th>
                <th>Ismi</th>
                <th>Email</th>
                <th>Roli</th>
                <th>Amallar</th>
            </tr>
        </thead>
        <tbody>
            @forelse($users as $index => $user)
                <tr>
                    <td>{{ $index + $users->firstItem() }}</td>
                    <td>{{ $user->name }}</td>
                    <td>{{ $user->email }}</td>
                    <td>{{ $user->role_id }}</td>
                    <td>
                        <a href="{{ route('admin.users.edit', $user) }}" class="btn btn-sm btn-warning">Tahrirlash</a>

                        <form action="{{ route('admin.users.destroy', $user) }}" method="POST" style="display:inline-block;" onsubmit="return confirm('Foydalanuvchini o‘chirishga ishonchingiz komilmi?')">
                            @csrf
                            @method('DELETE')
                            <button class="btn btn-sm btn-danger">O‘chirish</button>
                        </form>
                    </td>
                </tr>
            @empty
                <tr><td colspan="5">Hozircha foydalanuvchilar yo‘q.</td></tr>
            @endforelse
        </tbody>
    </table>

    {{ $users->links() }}
</div>
@endsection
