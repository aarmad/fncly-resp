<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->categories;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
            'color' => 'nullable|string|max:7',
        ]);

        return $request->user()->categories()->create($validated);
    }

    public function show(Category $category)
    {
        if ($category->user_id !== request()->user()->id) {
            abort(403);
        }
        return $category;
    }

    public function update(Request $request, Category $category)
    {
        if ($category->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:income,expense',
            'color' => 'nullable|string|max:7',
        ]);

        $category->update($validated);
        return $category;
    }

    public function destroy(Category $category)
    {
        if ($category->user_id !== request()->user()->id) {
            abort(403);
        }
        $category->transactions()->update(['category_id' => null]);
        $category->delete();
        return response()->noContent();
    }
}
