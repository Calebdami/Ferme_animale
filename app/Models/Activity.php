<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Activity extends Model
{
    protected $fillable = [
        'title', 'slug', 'icon', 'description', 'content', 'cover_image', 'focal_x', 'focal_y', 'zoom', 'position', 'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'focal_x' => 'float',
        'focal_y' => 'float',
        'zoom' => 'float',
        'position' => 'integer',
    ];

    protected $appends = ['cover_image_url', 'media_list'];

    protected static function booted(): void
    {
        static::creating(function ($activity) {
            if (! $activity->slug && $activity->title) {
                $activity->slug = Str::slug($activity->title).'-'.Str::random(4);
            }
        });
    }

    protected function coverImageUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->cover_image) {
                    return Storage::disk('public')->url($this->cover_image);
                }
                $firstMedia = MediaItem::where('collection', "activity_{$this->id}")->orderBy('position')->orderBy('id')->first();
                return $firstMedia ? $firstMedia->url : null;
            }
        );
    }

    protected function mediaList(): Attribute
    {
        return Attribute::make(
            get: fn () => MediaItem::where('collection', "activity_{$this->id}")->orderBy('position')->orderBy('id')->get()
        );
    }
}
