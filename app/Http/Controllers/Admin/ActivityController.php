<?php

namespace App\Http\Controllers\Admin;

use App\Events\ContentUpdated;
use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\MediaItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Activities/Index', [
            'activities' => Activity::orderBy('position')->orderBy('id')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['title']).'-'.Str::random(4);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('activities', 'public');
        }

        $activity = Activity::create($data);

        // Enregistrer les fichiers médias multiples (photos et vidéos)
        if ($request->hasFile('media_files')) {
            foreach ($request->file('media_files') as $file) {
                $isVideo = str_starts_with($file->getMimeType(), 'video');
                MediaItem::create([
                    'type'       => $isVideo ? 'video' : 'image',
                    'collection' => "activity_{$activity->id}",
                    'path'       => $file->store('activities', 'public'),
                ]);
            }
        }

        broadcast(new ContentUpdated('activities'));

        return back()->with('success', 'Activité ajoutée.');
    }

    public function update(Request $request, Activity $activity): RedirectResponse
    {
        $data = $this->validated($request);

        if ($request->hasFile('cover_image')) {
            if ($activity->cover_image) {
                Storage::disk('public')->delete($activity->cover_image);
            }
            $data['cover_image'] = $request->file('cover_image')->store('activities', 'public');
        }

        $activity->update($data);

        // Upload de médias additionnels
        if ($request->hasFile('media_files')) {
            foreach ($request->file('media_files') as $file) {
                $isVideo = str_starts_with($file->getMimeType(), 'video');
                MediaItem::create([
                    'type'       => $isVideo ? 'video' : 'image',
                    'collection' => "activity_{$activity->id}",
                    'path'       => $file->store('activities', 'public'),
                ]);
            }
        }

        broadcast(new ContentUpdated('activities'));

        return back()->with('success', 'Activité mise à jour.');
    }

    public function destroy(Activity $activity): RedirectResponse
    {
        if ($activity->cover_image) {
            Storage::disk('public')->delete($activity->cover_image);
        }

        // Supprimer les médias associés
        $mediaItems = MediaItem::where('collection', "activity_{$activity->id}")->get();
        foreach ($mediaItems as $media) {
            Storage::disk('public')->delete($media->path);
            $media->delete();
        }

        $activity->delete();
        broadcast(new ContentUpdated('activities'));

        return back()->with('success', 'Activité supprimée.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title'        => ['required', 'string', 'max:255'],
            'icon'         => ['nullable', 'string', 'max:100'],
            'description'  => ['nullable', 'string'],
            'content'      => ['nullable', 'string'],
            'position'     => ['nullable', 'integer'],
            'is_published' => ['boolean'],
            'focal_x'      => ['nullable', 'numeric', 'min:0', 'max:100'],
            'focal_y'      => ['nullable', 'numeric', 'min:0', 'max:100'],
            'zoom'         => ['nullable', 'numeric', 'min:1', 'max:5'],
        ]);
    }
}
