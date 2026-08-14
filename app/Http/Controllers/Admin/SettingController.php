<?php

namespace App\Http\Controllers\Admin;

use App\Events\ContentUpdated;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/Settings/Edit', [
            'settings' => Setting::orderBy('group')->orderBy('id')->get(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $payload = $request->input('settings', []);
        $removeIds = $request->input('remove_settings', []);

        // Suppression explicite des médias demandée par l'admin
        foreach ($removeIds as $removeId) {
            $setting = Setting::find($removeId);
            if ($setting) {
                if ($setting->value && ! str_starts_with($setting->value, 'http')) {
                    Storage::disk('public')->delete($setting->value);
                }
                $setting->update(['value' => null]);
            }
        }

        // Mise à jour des valeurs textuelles / focal points
        foreach ($payload as $item) {
            $setting = Setting::find($item['id']);
            if (! $setting) {
                continue;
            }

            // Ne pas écraser une valeur image/vidéo s'il n'y a pas eu de suppression explicite
            if (in_array($setting->type, ['image', 'video'], true) && ! in_array($setting->id, $removeIds, true)) {
                continue;
            }

            $setting->update(['value' => $item['value']]);
        }

        // Upload de nouveaux fichiers
        foreach ($request->file('files', []) as $settingId => $file) {
            $setting = Setting::find($settingId);
            if (! $setting || ! $file) {
                continue;
            }

            if ($setting->value && ! str_starts_with($setting->value, 'http')) {
                Storage::disk('public')->delete($setting->value);
            }

            $setting->update(['value' => $file->store('settings', 'public')]);
        }

        broadcast(new ContentUpdated('settings'));

        return back()->with('success', 'Réglages mis à jour.');
    }
}
