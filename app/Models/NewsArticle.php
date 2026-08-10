<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

class NewsArticle extends Model
{
    protected $fillable = [
        'title', 'slug', 'excerpt', 'content', 'cover_image', 'is_published', 'published_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected $appends = ['cover_image_url'];

    protected function coverImageUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->cover_image ? Storage::disk('public')->url($this->cover_image) : null,
        );
    }
}
