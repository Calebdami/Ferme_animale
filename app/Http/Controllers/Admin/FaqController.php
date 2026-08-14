<?php

namespace App\Http\Controllers\Admin;

use App\Events\ContentUpdated;
use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Faq/Index', [
            'faqs' => Faq::orderBy('position')->orderBy('id')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('faq', 'public');
        }

        Faq::create($data);
        broadcast(new ContentUpdated('faq'));

        return back()->with('success', 'Question FAQ ajoutée.');
    }

    public function update(Request $request, Faq $faq): RedirectResponse
    {
        $data = $this->validated($request);

        if ($request->hasFile('image')) {
            if ($faq->image) {
                Storage::disk('public')->delete($faq->image);
            }
            $data['image'] = $request->file('image')->store('faq', 'public');
        }

        $faq->update($data);
        broadcast(new ContentUpdated('faq'));

        return back()->with('success', 'Question FAQ mise à jour.');
    }

    public function destroy(Faq $faq): RedirectResponse
    {
        if ($faq->image) {
            Storage::disk('public')->delete($faq->image);
        }
        $faq->delete();
        broadcast(new ContentUpdated('faq'));

        return back()->with('success', 'Question FAQ supprimée.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'question'     => ['required', 'string', 'max:500'],
            'answer'       => ['required', 'string'],
            'position'     => ['nullable', 'integer'],
            'is_published' => ['boolean'],
            'focal_x'      => ['nullable', 'numeric', 'min:0', 'max:100'],
            'focal_y'      => ['nullable', 'numeric', 'min:0', 'max:100'],
            'zoom'         => ['nullable', 'numeric', 'min:1', 'max:5'],
        ]);
    }
}
