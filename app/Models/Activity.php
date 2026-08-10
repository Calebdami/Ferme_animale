<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = ['title', 'icon', 'description', 'position', 'is_published'];

    protected $casts = [
        'is_published' => 'boolean',
    ];
}
