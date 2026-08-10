<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

class PoultryType extends Model
{
    protected $fillable = [
        'name', 'slug', 'category', 'origin', 'description', 'characteristics',
        'available_ages', 'price', 'image', 'is_available', 'position',
    ];

    protected $casts = [
        'is_available' => 'boolean',
    ];

    protected $appends = ['image_url'];

    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->image ? Storage::disk('public')->url($this->image) : null,
        );
    }
}
