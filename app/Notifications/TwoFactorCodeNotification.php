<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TwoFactorCodeNotification extends Notification
{
    use Queueable;

    public function __construct(public string $code)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Votre code de vérification à deux facteurs - Ferme Avicole')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Voici votre code de sécurité temporaire pour vous connecter à l\'espace d\'administration :')
            ->line('**' . $this->code . '**')
            ->line('Ce code est valable pendant 10 minutes.')
            ->line('Si vous n\'êtes pas à l\'origine de cette tentative de connexion, veuillez ignorer ce message ou avertir l\'administrateur.');
    }
}
