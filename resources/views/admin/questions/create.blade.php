@extends('layouts.admin')

@section('content')
<div class="container mx-auto py-8">
  <div id="app" data-page="question"></div>
</div>

<script>
  window.topics = @json($topics);
</script>
@endsection
