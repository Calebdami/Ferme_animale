<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class NewsArticleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/News/Index', [
            'articles' => NewsArticle::latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/News/Form', ['article' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['title']).'-'.Str::random(4);
        $data['published_at'] = $data['is_published'] ? now() : null;

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('news', 'public');
        }

        NewsArticle::create($data);

        return redirect()->route('admin.news.index')->with('success', 'Article publié.');
    }

    public function edit(NewsArticle $article): Response
    {
        return Inertia::render('Admin/News/Form', ['article' => $article]);
    }

    public function update(Request $request, NewsArticle $article): RedirectResponse
    {
        $data = $this->validated($request);
        if ($data['is_published'] && ! $article->published_at) {
            $data['published_at'] = now();
        }

        if ($request->hasFile('cover_image')) {
            if ($article->cover_image) {
                Storage::disk('public')->delete($article->cover_image);
            }
            $data['cover_image'] = $request->file('cover_image')->store('news', 'public');
        }

        $article->update($data);

        return redirect()->route('admin.news.index')->with('success', 'Article mis à jour.');
    }

    public function destroy(NewsArticle $article): RedirectResponse
    {
        if ($article->cover_image) {
            Storage::disk('public')->delete($article->cover_image);
        }
        $article->delete();

        return back()->with('success', 'Article supprimé.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['nullable', 'string'],
            'is_published' => ['boolean'],
        ]);
    }
}
