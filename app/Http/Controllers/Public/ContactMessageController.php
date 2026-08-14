<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Setting;
use App\Notifications\NewContactMessageNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\AnonymousNotifiable;

class ContactMessageController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'email'   => ['required', 'email', 'max:255'],
            'phone'   => ['nullable', 'string', 'max:20'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        ContactMessage::create($data);

        // Récupérer l'e-mail de contact configuré dans les réglages
        $adminEmail = Setting::where('key', 'contact_email')->value('value');

        // Envoyer une notification e-mail à l'adresse de contact configurée
        if ($adminEmail) {
            try {
                (new AnonymousNotifiable)
                    ->route('mail', $adminEmail)
                    ->notify(new NewContactMessageNotification(
                        senderName:  $data['name'],
                        senderEmail: $data['email'],
                        senderPhone: $data['phone'] ?? '',
                        subject:     $data['subject'] ?? '',
                        messageBody: $data['message'],
                    ));
            } catch (\Throwable $e) {
                // Ne pas bloquer l'utilisateur si l'envoi d'e-mail échoue
            }
        }

        return back()->with('success', 'Votre message a bien été envoyé. Nous vous répondrons rapidement.');
    }
}
