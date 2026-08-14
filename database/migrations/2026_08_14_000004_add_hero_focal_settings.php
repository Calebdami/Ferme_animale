<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Setting::firstOrCreate(
            ['key' => 'hero_focal_x'],
            ['group' => 'hero', 'type' => 'text', 'label' => 'Hero Focal X', 'value' => '50']
        );
        Setting::firstOrCreate(
            ['key' => 'hero_focal_y'],
            ['group' => 'hero', 'type' => 'text', 'label' => 'Hero Focal Y', 'value' => '50']
        );
        Setting::firstOrCreate(
            ['key' => 'hero_zoom'],
            ['group' => 'hero', 'type' => 'text', 'label' => 'Hero Zoom', 'value' => '1']
        );
    }

    public function down(): void
    {
        Setting::whereIn('key', ['hero_focal_x', 'hero_focal_y', 'hero_zoom'])->delete();
    }
};
