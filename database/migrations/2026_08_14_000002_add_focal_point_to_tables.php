<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->float('hero_focal_x')->default(50)->after('hero_image');
            $table->float('hero_focal_y')->default(50)->after('hero_focal_x');
            $table->float('hero_zoom')->default(1)->after('hero_focal_y');
        });

        Schema::table('news_articles', function (Blueprint $table) {
            $table->float('focal_x')->default(50)->after('cover_image');
            $table->float('focal_y')->default(50)->after('focal_x');
            $table->float('zoom')->default(1)->after('focal_y');
        });

        Schema::table('media_items', function (Blueprint $table) {
            $table->float('focal_x')->default(50)->after('path');
            $table->float('focal_y')->default(50)->after('focal_x');
            $table->float('zoom')->default(1)->after('focal_y');
        });

        Schema::table('poultry_types', function (Blueprint $table) {
            $table->float('focal_x')->default(50)->nullable()->after('image');
            $table->float('focal_y')->default(50)->nullable()->after('focal_x');
            $table->float('zoom')->default(1)->nullable()->after('focal_y');
        });

        if (Schema::hasTable('activities')) {
            Schema::table('activities', function (Blueprint $table) {
                $table->float('focal_x')->default(50)->nullable();
                $table->float('focal_y')->default(50)->nullable();
                $table->float('zoom')->default(1)->nullable();
            });
        }
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn(['hero_focal_x', 'hero_focal_y', 'hero_zoom']);
        });

        Schema::table('news_articles', function (Blueprint $table) {
            $table->dropColumn(['focal_x', 'focal_y', 'zoom']);
        });

        Schema::table('media_items', function (Blueprint $table) {
            $table->dropColumn(['focal_x', 'focal_y', 'zoom']);
        });

        Schema::table('poultry_types', function (Blueprint $table) {
            $table->dropColumn(['focal_x', 'focal_y', 'zoom']);
        });

        if (Schema::hasTable('activities')) {
            Schema::table('activities', function (Blueprint $table) {
                $table->dropColumn(['focal_x', 'focal_y', 'zoom']);
            });
        }
    }
};
