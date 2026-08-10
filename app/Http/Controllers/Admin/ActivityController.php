<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Activities/Index', [
            'activities' => Activity::orderBy('position')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Activity::create($this->validated($request));

        return back()->with('success', 'Activité ajoutée.');
    }

    public function update(Request $request, Activity $activity): RedirectResponse
    {
        $activity->update($this->validated($request));

        return back()->with('success', 'Activité mise à jour.');
    }

    public function destroy(Activity $activity): RedirectResponse
    {
        $activity->delete();

        return back()->with('success', 'Activité supprimée.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'position' => ['nullable', 'integer'],
            'is_published' => ['boolean'],
        ]);
    }
}
