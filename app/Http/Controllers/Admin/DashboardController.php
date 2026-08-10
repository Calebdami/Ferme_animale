<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\NewsArticle;
use App\Models\PoultryType;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'poultryTypes' => PoultryType::count(),
                'poultryAvailable' => PoultryType::where('is_available', true)->count(),
                'newsArticles' => NewsArticle::count(),
                'unreadMessages' => ContactMessage::where('is_read', false)->count(),
            ],
            'recentMessages' => ContactMessage::latest()->take(5)->get(),
        ]);
    }
}
