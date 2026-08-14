<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewContactMessageNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $senderName,
        public string $senderEmail,
        public string $senderPhone,
        public string $subject,
        public string $messageBody,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $subject = $this->subject ?: '(Sans sujet)';
        $phone   = $this->senderPhone ?: 'Non renseigné';

        return (new MailMessage)
            ->subject("📩 Nouveau message de contact : {$subject}")
            ->greeting("Nouveau message reçu sur le site")
            ->line("**Nom :** {$this->senderName}")
            ->line("**E-mail :** {$this->senderEmail}")
            ->line("**Téléphone :** {$phone}")
            ->line("**Sujet :** {$subject}")
            ->line("---")
            ->line("**Message :**")
            ->line($this->messageBody)
            ->line("---")
            ->line("Vous pouvez répondre directement à ce client en cliquant sur le bouton ci-dessous.")
            ->action("Répondre à {$this->senderName}", "mailto:{$this->senderEmail}");
    }
}
