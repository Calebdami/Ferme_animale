<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        $clientId = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');

        if (empty($clientId) || empty($clientSecret) || $clientId === 'votre_google_client_id') {
            return redirect()->route('login')->withErrors([
                'google' => "La connexion Google nécessite la configuration des clés GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET dans votre fichier .env.",
            ]);
        }

        return Socialite::driver('google')->redirect();
    }

    public function callback(Request $request): RedirectResponse
    {
        try {
            /** @var \Laravel\Socialite\Two\User $googleUser */
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return redirect()->route('login')->withErrors([
                'google' => 'Échec de la connexion Google. Veuillez réessayer.',
            ]);
        }

        $email = $googleUser->getEmail();
        $user = User::where('email', $email)->first();

        if (! $user) {
            return redirect()->route('login')->withErrors([
                'email' => "Aucun compte administrateur n'est associé à l'adresse Google ({$email}).",
            ]);
        }

        if (! $user->is_active) {
            return redirect()->route('login')->withErrors([
                'email' => 'Votre compte administrateur est actuellement désactivé.',
            ]);
        }

        Auth::login($user, true);
        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'));
    }
}
