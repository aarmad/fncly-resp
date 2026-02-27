<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Seed Default Categories
        $defaults = [
            ['name' => 'Logement', 'type' => 'expense', 'color' => '#f87171'],
            ['name' => 'Transport', 'type' => 'expense', 'color' => '#fbbf24'],
            ['name' => 'Alimentation', 'type' => 'expense', 'color' => '#34d399'],
            ['name' => 'Loisirs', 'type' => 'expense', 'color' => '#60a5fa'],
            ['name' => 'Santé', 'type' => 'expense', 'color' => '#ec4899'],
            ['name' => 'Salaire', 'type' => 'income', 'color' => '#818cf8'],
        ];

        foreach ($defaults as $cat) {
            $user->categories()->create($cat);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.']
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}
