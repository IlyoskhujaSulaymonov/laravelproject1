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
                    @if (auth()->user()->role->name === 'admin')
                        <span class="text-blue-500 font-bold text-xl">O'qituvchilar kiritgan savollar</span>
                        <div class="rounded-xl border p-5 mt-5 shadow-md w-9/12 bg-white">
                            <div class="flex w-full items-center justify-between border-b pb-3">
                                <div class="flex items-center space-x-3">
                                    <div class="h-8 w-8 rounded-full bg-slate-400 bg-[url('https://i.pravatar.cc/32')]">
                                    </div>
                                    <div class="text-lg font-bold text-slate-700">Joe Smith</div>
                                </div>
                                <div class="flex items-center space-x-8">
                                    <button
                                        class="rounded-2xl border bg-neutral-100 px-3 py-1 text-xs font-semibold">Category</button>
                                    <div class="text-xs text-neutral-500">2 hours ago</div>
                                </div>
                            </div>

                            <div class="mt-4 mb-6">
                                <div class="mb-3 text-xl font-bold">Nulla sed leo tempus, feugiat velit vel, rhoncus
                                    neque?
                                </div>
                                <div class="text-sm text-neutral-600">Aliquam a tristique sapien, nec bibendum urna.
                                    Maecenas convallis dignissim turpis, non suscipit mauris interdum at. Morbi sed
                                    gravida
                                    nisl, a pharetra nulla. Etiam tincidunt turpis leo, ut mollis ipsum consectetur
                                    quis.
                                    Etiam faucibus est risus, ac condimentum mauris consequat nec. Curabitur eget
                                    feugiat
                                    massa</div>
                            </div>
                        </div>
                        <div class="rounded-xl border p-5 mt-5 shadow-md w-9/12 bg-white">
                            <div class="flex w-full items-center justify-between border-b pb-3">
                                <div class="flex items-center space-x-3">
                                    <div class="h-8 w-8 rounded-full bg-slate-400 bg-[url('https://i.pravatar.cc/32')]">
                                    </div>
                                    <div class="text-lg font-bold text-slate-700">Joe Smith</div>
                                </div>
                                <div class="flex items-center space-x-8">
                                    <button
                                        class="rounded-2xl border bg-neutral-100 px-3 py-1 text-xs font-semibold">Category</button>
                                    <div class="text-xs text-neutral-500">2 hours ago</div>
                                </div>
                            </div>

                            <div class="mt-4 mb-6">
                                <div class="mb-3 text-xl font-bold">Nulla sed leo tempus, feugiat velit vel, rhoncus
                                    neque?
                                </div>
                                <div class="text-sm text-neutral-600">Aliquam a tristique sapien, nec bibendum urna.
                                    Maecenas convallis dignissim turpis, non suscipit mauris interdum at. Morbi sed
                                    gravida
                                    nisl, a pharetra nulla. Etiam tincidunt turpis leo, ut mollis ipsum consectetur
                                    quis.
                                    Etiam faucibus est risus, ac condimentum mauris consequat nec. Curabitur eget
                                    feugiat
                                    massa</div>
                            </div>
                        </div>
                    @elseif (auth()->user()->role->name === 'teacher')
                        <div
                            class='flex items-center justify-center min-h-screen from-teal-100 via-teal-300 to-teal-500 bg-gradient-to-br'>
                            <div class='w-full max-w-lg px-10 py-8 mx-auto bg-white rounded-lg shadow-xl'>
                                <div class='max-w-md mx-auto space-y-6'>
                                    <form action="" method="POST" enctype="multipart/form-data">
                                        @csrf
                                        <h2 class="text-2xl font-bold ">Savollar faylini yuboring</h2>
                                        <hr class="my-6">
                                        <label class="uppercase text-sm font-bold opacity-70">Fanni tanlang</label>
                                        <select
                                            class="w-full p-3 mt-2 mb-4 w-full bg-slate-200 rounded border-2 border-slate-200 focus:border-slate-600 focus:outline-none">
                                            <option value=""></option>
                                            <option value="">Algebra</option>
                                            <option value="">Geometriya</option>
                                            {{-- <option value="">Ingliz tili grammatika</option>
                                            <option value="">Reading</option>
                                            <option value="">Listening</option> --}}
                                        </select>
                                        <label class="uppercase text-sm font-bold opacity-70">Mavzuni kiriting</label>
                                        <textarea rows="2"
                                            class="p-3 mt-2 mb-4 w-full bg-slate-200 rounded border-2 border-slate-200 focus:border-slate-600 focus:outline-none"></textarea>
                                        <label class="uppercase text-sm font-bold opacity-70">Faylni yuklang
                                            (.pdf)</label>
                                        <input type="file"
                                            class="p-3 mt-2 mb-4 w-full bg-slate-200 rounded border-2 border-slate-200 focus:border-slate-600 focus:outline-none">
                                        <input type="submit"
                                            class="py-3 px-6 my-2 bg-emerald-500 text-white font-medium rounded hover:bg-indigo-500 cursor-pointer ease-in-out duration-300"
                                            value="Yuborish">
                                    </form>
                                </div>
                            </div>
                        </div>
                    @else
                        <div class="text-center">
                            <h1 class="text-2xl font-bold">Dashboard</h1>
                    @endif
                </div>
            </div>
        </div>
    </div>
</x-app-layout>