<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div
                        class='flex items-center justify-center min-h-screen from-teal-100 via-teal-300 to-teal-500 bg-gradient-to-br'>
                        <div class='w-full max-w-lg px-10 py-8 mx-auto bg-white rounded-lg shadow-xl'>
                            <div class='max-w-md mx-auto space-y-6'>
                                @if (session('success'))
                                    <div
                                        class="alert alert-success text-green-600 font-bold p-3 rounded bg-green-100 mb-4">
                                        {{ session('success') }}
                                    </div>
                                @endif
                                <form action="{{ route('questions.store') }}" method="POST"
                                    enctype="multipart/form-data">
                                    @csrf
                                    <h2 class="text-2xl font-bold ">Savollar faylini yuboring</h2>
                                    <hr class="my-6">
                                    <label class="uppercase text-sm font-bold opacity-70">Fanni tanlang</label>
                                    <select name="subject" required
                                        class="p-3 mt-2 mb-4 w-full bg-slate-200 rounded border-2 border-slate-200 focus:border-slate-600 focus:outline-none">
                                        <option value="">Fan tanlang</option>
                                        <option value="Algebra">Algebra</option>
                                        <option value="Geometriya">Geometriya</option>
                                    </select>
                                    <label class="uppercase text-sm font-bold opacity-70">Mavzuni kiriting</label>
                                    <textarea rows="2" name="topic" required
                                        class="p-3 mt-2 mb-4 w-full bg-slate-200 rounded border-2 border-slate-200 focus:border-slate-600 focus:outline-none"></textarea>
                                    <label class="uppercase text-sm font-bold opacity-70">Faylni yuklang
                                        (.pdf,.doc,.docx)</label>
                                    <input type="file" name="file" required
                                        class="p-3 mt-2 mb-4 w-full bg-slate-200 rounded border-2 border-slate-200 focus:border-slate-600 focus:outline-none">
                                    <input type="submit"
                                        class="py-3 px-6 my-2 bg-emerald-500 text-white font-medium rounded hover:bg-indigo-500 cursor-pointer ease-in-out duration-300"
                                        value="Yuborish">
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
