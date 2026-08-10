<?php

namespace App\Http\Controllers\Admin;

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

        foreach ($payload as $item) {
            $setting = Setting::find($item['id']);
            if (! $setting || in_array($setting->type, ['image', 'video'], true)) {
                continue;
            }

            $setting->update(['value' => $item['value']]);
        }

        foreach ($request->file('files', []) as $settingId => $file) {
            $setting = Setting::find($settingId);
            if (! $setting || ! $file) {
                continue;
            }

            if ($setting->value) {
                Storage::disk('public')->delete($setting->value);
            }

            $setting->update(['value' => $file->store('settings', 'public')]);
        }

        return back()->with('success', 'Réglages mis à jour.');
    }
}
