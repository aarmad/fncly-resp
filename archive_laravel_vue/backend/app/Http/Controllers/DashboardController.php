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

            $startDate = $request->query('start_date');
            $endDate = $request->query('end_date');
            $type = $request->query('type');
            $categoryId = $request->query('category_id');

            $query = DB::table('transactions')->where('transactions.user_id', $user->id);

            if ($startDate) {
                $query->where('date', '>=', $startDate);
            }
            if ($endDate) {
                $query->where('date', '<=', $endDate);
            }
            if ($type) {
                $query->where('transactions.type', $type);
            }
            if ($categoryId) {
                $query->where('transactions.category_id', $categoryId);
            }

            // Totals
            $income = (clone $query)->where('type', 'income')->sum('amount');
            $expense = (clone $query)->where('type', 'expense')->sum('amount');
            $balance = $income - $expense;

            // By Category (Expenses only)
            $byCategory = (clone $query)
                ->where('transactions.type', 'expense')
                ->leftJoin('categories', 'transactions.category_id', '=', 'categories.id')
                ->select(DB::raw('COALESCE(categories.name, "Non catégorisé") as name'), DB::raw('SUM(transactions.amount) as total'))
                ->groupBy('name')
                ->get();

            // Monthly Data (last 6 months - we keep this as is for the chart trend, or filter it too?)
            // Usually charts show a trend regardless of current filter, but let's base it on the filter if provided, 
            // or just keep 6 months history. Let's keep 6 months history for the dashboard chart trend.
            $monthly = DB::table('transactions')
                ->where('transactions.user_id', $user->id)
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
                'monthly' => $monthly,
                'filters' => [
                    'start_date' => $startDate,
                    'end_date' => $endDate
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function exportPdf(Request $request)
    {
        try {
            $response = $this->stats($request);
            $data = $response->getData(true);

            if (isset($data['error'])) {
                return response()->json(['error' => 'Stats error: ' . $data['error']], 500);
            }

            $user = $request->user();
            $startDate = $request->query('start_date');
            $endDate = $request->query('end_date');

            $query = $user->transactions()->with('category')->latest();

            if ($startDate) {
                $query->where('date', '>=', $startDate);
            }
            if ($endDate) {
                $query->where('date', '<=', $endDate);
            }

            $transactions = $query->get();

            $pdf = Pdf::loadView('reports.monthly', [
                'data' => $data,
                'user' => $user,
                'transactions' => $transactions,
                'startDate' => $startDate,
                'endDate' => $endDate
            ]);

            return $pdf->download('Rapport_Financier.pdf');
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
