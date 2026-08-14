<?php

namespace App\Http\Controllers\Admin;

use App\Events\ContentUpdated;
use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Pages/Index', [
            'pages' => Page::orderBy('title')->get(),
        ]);
    }

    public function edit(Page $page): Response
    {
        return Inertia::render('Admin/Pages/Edit', [
            'page' => $page,
        ]);
    }

    public function update(Request $request, Page $page): RedirectResponse
    {
        $data = $request->validate([
            'title'            => ['required', 'string', 'max:255'],
            'subtitle'         => ['nullable', 'string', 'max:255'],
            'content'          => ['nullable', 'string'],
            'meta_description' => ['nullable', 'string', 'max:255'],
            'is_published'     => ['boolean'],
            'hero_image'       => ['nullable', 'image', 'max:10240'],
            'hero_focal_x'     => ['nullable', 'numeric', 'min:0', 'max:100'],
            'hero_focal_y'     => ['nullable', 'numeric', 'min:0', 'max:100'],
            'hero_zoom'        => ['nullable', 'numeric', 'min:1', 'max:5'],
        ]);

        if ($request->hasFile('hero_image')) {
            if ($page->hero_image) {
                Storage::disk('public')->delete($page->hero_image);
            }
            $data['hero_image'] = $request->file('hero_image')->store('pages', 'public');
        }

        $page->update($data);
        broadcast(new ContentUpdated('pages', $page->slug));

        return back()->with('success', 'Page mise à jour.');
    }
}
