<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\TwoFactorCodeNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'Identifiants incorrects.',
            ]);
        }

        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'email' => 'Votre compte administrateur est désactivé. Veuillez contacter l\'administrateur principal.',
            ]);
        }

        // Si la 2FA est activée pour l'utilisateur
        if ($user->two_factor_enabled) {
            $code = $user->generateTwoFactorCode();

            try {
                $user->notify(new TwoFactorCodeNotification($code));
            } catch (\Throwable $e) {
            }

            $request->session()->put('login.id', $user->id);
            $request->session()->put('login.remember', $request->boolean('remember'));

            return redirect()->route('login.2fa');
        }

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'));
    }

    public function createTwoFactor(Request $request): RedirectResponse|Response
    {
        if (! $request->session()->has('login.id')) {
            return redirect()->route('login');
        }

        $user = User::find($request->session()->get('login.id'));
        if (! $user) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/TwoFactorChallenge', [
            'email' => $user->email,
        ]);
    }

    public function storeTwoFactor(Request $request): RedirectResponse
    {
        if (! $request->session()->has('login.id')) {
            return redirect()->route('login');
        }

        $request->validate([
            'code' => ['required', 'string'],
        ]);

        $user = User::find($request->session()->get('login.id'));

        if (! $user || $user->two_factor_code !== trim($request->code) || ! $user->two_factor_expires_at || $user->two_factor_expires_at->isPast()) {
            throw ValidationException::withMessages([
                'code' => 'Le code à deux facteurs est invalide ou a expiré.',
            ]);
        }

        $user->resetTwoFactorCode();

        Auth::login($user, $request->session()->get('login.remember', false));

        $request->session()->forget(['login.id', 'login.remember']);
        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'));
    }

    public function resendTwoFactor(Request $request): RedirectResponse
    {
        if (! $request->session()->has('login.id')) {
            return redirect()->route('login');
        }

        $user = User::find($request->session()->get('login.id'));
        if ($user) {
            $code = $user->generateTwoFactorCode();
            try {
                $user->notify(new TwoFactorCodeNotification($code));
            } catch (\Throwable $e) {
            }
        }

        return back()->with('success', 'Un nouveau code de vérification a été envoyé à votre adresse e-mail.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
