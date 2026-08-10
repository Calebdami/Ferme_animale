<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Messages/Index', [
            'messages' => ContactMessage::latest()->get(),
        ]);
    }

    public function update(ContactMessage $message): RedirectResponse
    {
        $message->update(['is_read' => true]);

        return back();
    }

    public function destroy(ContactMessage $message): RedirectResponse
    {
        $message->delete();

        return back()->with('success', 'Message supprimé.');
    }
}
