<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Faq extends Model
{
    protected $fillable = [
        'question', 'answer', 'image', 'focal_x', 'focal_y', 'zoom', 'position', 'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'focal_x' => 'float',
        'focal_y' => 'float',
        'zoom' => 'float',
        'position' => 'integer',
    ];

    protected $appends = ['image_url'];

    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->image ? Storage::disk('public')->url($this->image) : null,
        );
    }
}
