<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user)
                return response()->json(['error' => 'No user'], 401);

            // Totals
            $income = DB::table('transactions')
                ->where('user_id', $user->id)
                ->where('type', 'income')
                ->sum('amount');

            $expense = DB::table('transactions')
                ->where('user_id', $user->id)
                ->where('type', 'expense')
                ->sum('amount');

            $balance = $income - $expense;

            // By Category (Expenses only)
            $byCategory = DB::table('transactions')
                ->where('transactions.user_id', $user->id)
                ->where('transactions.type', 'expense')
                ->leftJoin('categories', 'transactions.category_id', '=', 'categories.id')
                ->select(DB::raw('COALESCE(categories.name, "Non catégorisé") as name'), DB::raw('SUM(transactions.amount) as total'))
                ->groupBy('name')
                ->get();

            // Monthly Data (last 6 months)
            $monthly = DB::table('transactions')
                ->where('user_id', $user->id)
                ->select(
                    DB::raw('DATE_FORMAT(date, "%Y-%m") as month'),
                    DB::raw('SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as income'),
                    DB::raw('SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as expense')
                )
                ->groupBy(DB::raw('DATE_FORMAT(date, "%Y-%m")'))
                ->orderBy('month', 'desc')
                ->limit(6)
                ->get()
                ->reverse()
                ->values();

            return response()->json([
                'balance' => (float) $balance,
                'income' => (float) $income,
                'expense' => (float) $expense,
                'by_category' => $byCategory,
                'monthly' => $monthly
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function exportPdf(Request $request)
    {
        try {
            $data = $this->stats($request)->getData(true);

            if (isset($data['error'])) {
                return response()->json(['error' => 'Stats error: ' . $data['error']], 500);
            }

            $user = $request->user();
            $transactions = $user->transactions()->with('category')->latest()->limit(50)->get();

            $pdf = Pdf::loadView('reports.monthly', [
                'data' => $data,
                'user' => $user,
                'transactions' => $transactions
            ]);

            return $pdf->download('report.pdf');
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
