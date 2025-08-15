@extends('layouts.admin')

@section('content')
<div class="container">
    <h1 class="mb-4">Fanlarning mavzulari</h1>

    @foreach (['success', 'danger', 'warning'] as $msg)
        @if(session($msg))
            <div class="alert alert-{{ $msg }}">{{ session($msg) }}</div>
        @endif
    @endforeach

    <div class="mb-3 d-flex justify-content-between align-items-center">
        <a href="{{ route('admin.topics.create') }}" class="btn btn-primary">Yangi yaratish</a>
    </div>

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>ID</th>
                <th>Fan nomi</th>
                <th>Nomi</th>
                <th>Tartib raqami</th>
                <th>Harakat</th>
            </tr>
            <tr>
                <form method="GET" action="{{ route('admin.topics.index') }}">
                    <td></td>
                    <td>
                        <select name="subject_id" class="form-select form-select-lg" onchange="this.form.submit()">
                            <option value="">Hammasi</option>
                            @foreach($subjects as $subject)
                                <option value="{{ $subject->id }}" {{ request('subject_id') == $subject->id ? 'selected' : '' }}>
                                    {{ $subject->name }}
                                </option>
                            @endforeach
                        </select>
                    </td>
                    <td>
                        <input type="text" name="search" value="{{ request('search') }}" class="form-control form-control-sm"  onchange="this.form.submit()">
                    </td>
                    <td>
                        <input type="text" name="order" value="{{ request('order') }}" class="form-control form-control-sm"  onchange="this.form.submit()">
                    </td>
                    <td>
                        <button type="submit" class="btn btn-sm btn-secondary">Filter</button>
                        <a href="{{ route('admin.topics.index') }}" class="btn btn-sm btn-light">Tozalash</a>
                    </td>
                </form>
            </tr>
        </thead>
        <tbody>
            @forelse($topics as $topic)
                <tr>
                    <td>{{ $topic->id }}</td>
                    <td>{{ $topic->subject?->name }}</td>
                    <td>{{ $topic->title }}</td>
                    <td>{{ $topic->order }}</td>
                    <td>
                        <a href="{{ route('admin.topics.edit', $topic) }}" class="btn btn-sm btn-warning">O'zgartirish</a>
                        <form action="{{ route('admin.topics.destroy', $topic) }}" method="POST" style="display:inline-block;">
                            @csrf
                            @method('DELETE')
                            <button class="btn btn-sm btn-danger" onclick="return confirm('Are you sure?')">O'chirish</button>
                        </form>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="5">Ma'lumot topilmadi.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="mt-3">
        <nav>
            {{ $topics->appends(request()->query())->links('pagination::bootstrap-4') }}
        </nav>
    </div>
</div>
@endsection
