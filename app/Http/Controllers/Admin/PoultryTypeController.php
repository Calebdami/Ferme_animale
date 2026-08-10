<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PoultryType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PoultryTypeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/PoultryTypes/Index', [
            'poultryTypes' => PoultryType::orderBy('position')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/PoultryTypes/Form', ['poultryType' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['name']).'-'.Str::random(4);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('poultry-types', 'public');
        }

        PoultryType::create($data);

        return redirect()->route('admin.poultry-types.index')->with('success', 'Type de volaille créé.');
    }

    public function edit(PoultryType $poultryType): Response
    {
        return Inertia::render('Admin/PoultryTypes/Form', ['poultryType' => $poultryType]);
    }

    public function update(Request $request, PoultryType $poultryType): RedirectResponse
    {
        $data = $this->validated($request);

        if ($request->hasFile('image')) {
            if ($poultryType->image) {
                Storage::disk('public')->delete($poultryType->image);
            }
            $data['image'] = $request->file('image')->store('poultry-types', 'public');
        }

        $poultryType->update($data);

        return redirect()->route('admin.poultry-types.index')->with('success', 'Type de volaille mis à jour.');
    }

    public function destroy(PoultryType $poultryType): RedirectResponse
    {
        if ($poultryType->image) {
            Storage::disk('public')->delete($poultryType->image);
        }
        $poultryType->delete();

        return back()->with('success', 'Type de volaille supprimé.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'origin' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'characteristics' => ['nullable', 'string'],
            'available_ages' => ['nullable', 'string', 'max:255'],
            'price' => ['nullable', 'string', 'max:100'],
            'is_available' => ['boolean'],
            'position' => ['nullable', 'integer'],
        ]);
    }
}
