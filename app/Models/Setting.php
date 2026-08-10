<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['group', 'key', 'value', 'type', 'label'];

    public static function get(string $key, $default = null)
    {
        $all = Cache::rememberForever('settings.all', fn () => static::all()->keyBy('key'));

        return $all[$key]->value ?? $default;
    }

    public static function allGrouped(): array
    {
        return static::orderBy('group')->get()->groupBy('group')->toArray();
    }

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget('settings.all'));
        static::deleted(fn () => Cache::forget('settings.all'));
    }
}
