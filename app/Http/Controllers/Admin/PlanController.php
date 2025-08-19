<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function index()
    {
        $plans = Plan::latest()->paginate(10);
        return view('admin.plans.index', compact('plans'));
    }

    public function create()
    {
        return view('admin.plans.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'features.*' => 'string|max:255',
        ]);

        Plan::create([
            'name' => $data['name'],
            'price' => $data['price'],
            'duration' => $data['duration'],
            'description' => $data['description'] ?? null,
            'features' => $data['features'] ?? [],
        ]);

        return redirect()->route('admin.plans.index')->with('success', "Tarif muvaffaqiyatli qo‘shildi!");
    }

    public function edit(Plan $plan)
    {
        return view('admin.plans.edit', compact('plan'));
    }

    public function update(Request $request, Plan $plan)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'features.*' => 'string|max:255',
        ]);

        $plan->update([
            'name' => $data['name'],
            'price' => $data['price'],
            'duration' => $data['duration'],
            'description' => $data['description'] ?? null,
            'features' => $data['features'] ?? [],
        ]);

        return redirect()->route('admin.plans.index')->with('success', "Tarif yangilandi!");
    }

    public function destroy(Plan $plan)
    {
        $plan->delete();
        return redirect()->route('admin.plans.index')->with('success', "Tarif o‘chirildi!");
    }

    public function show(Plan $plan)
    {
        return view('admin.plans.show', compact('plan'));
    }
}
