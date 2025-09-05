<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PlanPurchaseRequest;
use App\Models\User;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PlanPurchaseRequestController extends Controller
{
    /**
     * Display a listing of plan purchase requests.
     */
    public function index(Request $request)
    {
        $query = PlanPurchaseRequest::with(['user', 'plan'])
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by plan
        if ($request->filled('plan_id')) {
            $query->where('plan_id', $request->plan_id);
        }

        // Search by user name or email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $requests = $query->paginate(20);

        // Get filter options
        $users = User::orderBy('name')->get();
        $plans = Plan::orderBy('name')->get();
        $statuses = ['pending' => 'Pending', 'approved' => 'Approved', 'rejected' => 'Rejected'];

        return view('admin.plan-purchase-requests.index', compact('requests', 'users', 'plans', 'statuses'));
    }

    /**
     * Display the specified plan purchase request.
     */
    public function show(PlanPurchaseRequest $planPurchaseRequest)
    {
        $planPurchaseRequest->load(['user', 'plan']);
        
        return view('admin.plan-purchase-requests.show', compact('planPurchaseRequest'));
    }

    /**
     * Update the status of a plan purchase request.
     */
    public function update(Request $request, PlanPurchaseRequest $planPurchaseRequest)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_response' => 'required|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            // Update the request
            $planPurchaseRequest->update([
                'status' => $request->status,
                'admin_response' => $request->admin_response,
                'responded_at' => now(),
            ]);

            // If approved, create user plan
            if ($request->status === 'approved') {
                // Here you would typically create the user plan
                // This is a simplified example
                // You might want to integrate with your existing payment/user plan system
            }

            DB::commit();

            return redirect()->route('admin.plan-purchase-requests.show', $planPurchaseRequest)
                ->with('success', 'Plan purchase request updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            
            return redirect()->back()
                ->with('error', 'Failed to update plan purchase request: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified plan purchase request.
     */
    public function destroy(PlanPurchaseRequest $planPurchaseRequest)
    {
        try {
            $planPurchaseRequest->delete();

            return redirect()->route('admin.plan-purchase-requests.index')
                ->with('success', 'Plan purchase request deleted successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete plan purchase request: ' . $e->getMessage());
        }
    }
}