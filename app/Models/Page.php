<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

class Page extends Model
{
    protected $fillable = [
        'slug', 'title', 'subtitle', 'hero_image', 'hero_focal_x', 'hero_focal_y', 'hero_zoom', 'content', 'meta_description', 'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'hero_focal_x' => 'float',
        'hero_focal_y' => 'float',
        'hero_zoom' => 'float',
    ];

    protected $appends = ['hero_image_url'];

    protected function heroImageUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->hero_image ? Storage::disk('public')->url($this->hero_image) : null,
        );
    }
}
