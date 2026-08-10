<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('poultry_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category'); // chair, ponte, reproducteur, pintade, dindon, canard, autre
            $table->string('origin')->nullable();
            $table->text('description')->nullable();
            $table->text('characteristics')->nullable();
            $table->string('available_ages')->nullable(); // ex: "1 jour, démarré 3 semaines"
            $table->string('price')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_available')->default(true);
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('poultry_types');
    }
};
