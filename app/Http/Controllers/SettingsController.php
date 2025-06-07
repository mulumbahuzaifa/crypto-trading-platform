<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/Index', [
            'user' => auth()->user(),
            'apiKeys' => auth()->user()->apiKeys()->get(),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . auth()->id(),
            'phone' => 'nullable|string|max:20',
            'language' => 'required|string|in:en,es,fr,de,zh,ru,ar',
            'currency' => 'required|string|in:USD,EUR,GBP,CHF',
        ]);

        auth()->user()->update($validated);

        return back()->with('success', 'Profile updated successfully.');
    }

    public function updateSecurity(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|current_password',
            'new_password' => 'required|string|min:8|confirmed',
            'security_question_1' => 'required|string',
            'security_answer_1' => 'required|string',
            'security_question_2' => 'required|string',
            'security_answer_2' => 'required|string',
            'security_question_3' => 'required|string',
            'security_answer_3' => 'required|string',
        ]);

        auth()->user()->update([
            'password' => Hash::make($validated['new_password']),
            'security_questions' => [
                [
                    'question' => $validated['security_question_1'],
                    'answer' => Hash::make($validated['security_answer_1']),
                ],
                [
                    'question' => $validated['security_question_2'],
                    'answer' => Hash::make($validated['security_answer_2']),
                ],
                [
                    'question' => $validated['security_question_3'],
                    'answer' => Hash::make($validated['security_answer_3']),
                ],
            ],
        ]);

        return back()->with('success', 'Security settings updated successfully.');
    }

    public function updateNotifications(Request $request)
    {
        $validated = $request->validate([
            'price_updates' => 'boolean',
            'two_factor' => 'boolean',
            'news_updates' => 'boolean',
            'email_notifications' => 'boolean',
            'phone_notifications' => 'boolean',
        ]);

        auth()->user()->update([
            'notification_settings' => $validated,
        ]);

        return back()->with('success', 'Notification settings updated successfully.');
    }

    public function createApiKey(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'required|current_password',
        ]);

        $apiKey = auth()->user()->apiKeys()->create([
            'name' => $validated['name'],
            'key' => bin2hex(random_bytes(16)),
            'is_active' => true,
        ]);

        return back()->with('success', 'API key created successfully.');
    }

    public function toggleApiKey(Request $request, $id)
    {
        $apiKey = auth()->user()->apiKeys()->findOrFail($id);
        $apiKey->update(['is_active' => !$apiKey->is_active]);

        return back()->with('success', 'API key status updated successfully.');
    }

    public function deleteApiKey($id)
    {
        $apiKey = auth()->user()->apiKeys()->findOrFail($id);
        $apiKey->delete();

        return back()->with('success', 'API key deleted successfully.');
    }
}