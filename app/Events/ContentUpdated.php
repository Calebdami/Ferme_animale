<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Événement générique émis dès qu'un contenu admin est modifié.
 * Le canal est public (pas besoin d'authentification côté vitrine).
 *
 * Usage :  broadcast(new ContentUpdated('activities'));
 *          broadcast(new ContentUpdated('settings'));
 *          broadcast(new ContentUpdated('pages', 'faq'));
 */
class ContentUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public string $section,
        public ?string $extra = null,
    ) {}

    public function broadcastOn(): Channel
    {
        return new Channel('site-content');
    }

    public function broadcastAs(): string
    {
        return 'content.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'section' => $this->section,
            'extra'   => $this->extra,
            'ts'      => now()->toIso8601String(),
        ];
    }
}
