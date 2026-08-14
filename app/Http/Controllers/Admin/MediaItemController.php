<?php

namespace App\Http\Controllers\Admin;

use App\Events\ContentUpdated;
use App\Http\Controllers\Controller;
use App\Models\MediaItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MediaItemController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Media/Index', [
            'mediaItems' => MediaItem::orderBy('collection')->orderBy('position')->orderBy('id', 'desc')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'collection' => ['required', 'string', 'max:100'],
            'title'      => ['nullable', 'string', 'max:255'],
            'alt_text'   => ['nullable', 'string', 'max:255'],
            'files'      => ['required', 'array'],
            'files.*'    => ['file', 'max:102400'],
        ]);

        foreach ($request->file('files') as $file) {
            $isVideo = str_starts_with($file->getMimeType(), 'video');
            MediaItem::create([
                'type'       => $isVideo ? 'video' : 'image',
                'collection' => $data['collection'],
                'path'       => $file->store('media', 'public'),
                'title'      => $data['title'] ?? null,
                'alt_text'   => $data['alt_text'] ?? null,
            ]);
        }

        broadcast(new ContentUpdated('media'));

        return back()->with('success', 'Média(s) ajouté(s).');
    }

    public function destroy(MediaItem $mediaItem): RedirectResponse
    {
        if ($mediaItem->path) {
            Storage::disk('public')->delete($mediaItem->path);
        }
        $mediaItem->delete();
        broadcast(new ContentUpdated('media'));

        return back()->with('success', 'Média supprimé.');
    }
}
