@extends('layouts.admin')

@section('content')
<div class="container">
    <h1 class="mb-4">Rollar ro‘yxtati</h1>

    <a href="{{ route('admin.roles.create') }}" class="btn btn-primary mb-3">Yangi rol qo‘shish</a>

    @if(session('success'))
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
            @forelse($roles as $index => $role)
                <tr>
                    <td>{{ $index + $roles->firstItem() }}</td>
                    <td>{{ $role->name }}</td>
                    <td>
                        <a href="{{ route('admin.roles.edit', $role) }}" class="btn btn-sm btn-warning">Tahrirlash</a>
                        <form action="{{ route('admin.roles.destroy', $role) }}" method="POST" class="d-inline" onsubmit="return confirm('O‘chirilsinmi?')">
                            @csrf
                            @method('DELETE')
                            <button class="btn btn-sm btn-danger">O‘chirish</button>
                        </form>
                    </td>
                </tr>
            @empty
                <tr><td colspan="3">Rollar mavjud emas.</td></tr>
            @endforelse
        </tbody>
    </table>

    {{ $roles->links() }}
</div>
@endsection
