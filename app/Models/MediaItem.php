<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaItem extends Model
{
    protected $fillable = ['type', 'collection', 'path', 'title', 'alt_text', 'position'];

    protected function url(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: fn () => $this->path ? \Illuminate\Support\Facades\Storage::disk('public')->url($this->path) : null,
        );
    }

    protected $appends = ['url'];
}
