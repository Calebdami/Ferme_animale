<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\MediaItem;
use App\Models\NewsArticle;
use App\Models\Page;
use App\Models\PoultryType;
use App\Models\Setting;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class SiteController extends Controller
{
    private function settingsFor(array $keys): array
    {
        $settings = Setting::whereIn('key', $keys)->get()->keyBy('key');
        $out = [];
        foreach ($keys as $key) {
            if (! isset($settings[$key])) {
                $out[$key] = null;
                continue;
            }
            $setting = $settings[$key];
            if (in_array($setting->type, ['image', 'video'], true) && $setting->value) {
                $out[$key] = \Illuminate\Support\Facades\Storage::disk('public')->url($setting->value);
            } else {
                $out[$key] = $setting->value;
            }
        }

        return $out;
    }

    private function pageOr404(string $slug): Page
    {
        $page = Page::where('slug', $slug)->first();
        if (! $page || ! $page->is_published) {
            abort(404);
        }

        return $page;
    }

    public function home(): Response
    {
        return Inertia::render('Public/Home', [
            'settings' => $this->settingsFor([
                'site_name', 'hero_title', 'hero_subtitle', 'hero_image', 'hero_video',
                'stat_years', 'stat_races', 'stat_capacity', 'stat_clients',
            ]),
            'activities' => Activity::where('is_published', true)->orderBy('position')->get(),
            'testimonials' => Testimonial::where('is_published', true)->latest()->take(6)->get(),
            'news' => NewsArticle::where('is_published', true)->latest('published_at')->take(3)->get(),
            'featuredPoultry' => PoultryType::where('is_available', true)->orderBy('position')->take(4)->get(),
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('Public/About', [
            'page' => $this->pageOr404('a-propos'),
            'settings' => $this->settingsFor(['founding_year', 'team_size', 'farm_area']),
            'team' => MediaItem::where('collection', 'team')->orderBy('position')->get(),
        ]);
    }

    public function poultry(): Response
    {
        return Inertia::render('Public/Poultry', [
            'page' => $this->pageOr404('races-poussins'),
            'poultryTypes' => PoultryType::orderBy('position')->get(),
        ]);
    }

    public function poultryShow(PoultryType $poultryType): Response
    {
        if (! $poultryType->is_available) {
            abort(404);
        }

        return Inertia::render('Public/PoultryShow', [
            'poultryType' => $poultryType,
        ]);
    }

    public function activities(): Response
    {
        return Inertia::render('Public/Activities', [
            'page' => $this->pageOr404('nos-activites'),
            'activities' => Activity::where('is_published', true)->orderBy('position')->get(),
        ]);
    }

    public function facilities(): Response
    {
        return Inertia::render('Public/Facilities', [
            'page' => $this->pageOr404('nos-locaux'),
            'photos' => MediaItem::where('collection', 'facilities')->orderBy('position')->get(),
        ]);
    }

    public function quality(): Response
    {
        return Inertia::render('Public/Quality', [
            'page' => $this->pageOr404('qualite-biosecurite'),
        ]);
    }

    public function gallery(): Response
    {
        return Inertia::render('Public/Gallery', [
            'items' => MediaItem::orderBy('collection')->orderBy('position')->get(),
        ]);
    }

    public function news(): Response
    {
        return Inertia::render('Public/News', [
            'articles' => NewsArticle::where('is_published', true)->latest('published_at')->paginate(9),
        ]);
    }

    public function newsShow(NewsArticle $article): Response
    {
        if (! $article->is_published) {
            abort(404);
        }

        return Inertia::render('Public/NewsShow', [
            'article' => $article,
        ]);
    }

    public function faq(): Response
    {
        return Inertia::render('Public/Faq', [
            'page' => $this->pageOr404('faq'),
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('Public/Contact', [
            'settings' => $this->settingsFor([
                'contact_phone', 'contact_whatsapp', 'contact_email', 'contact_address',
                'contact_hours', 'map_embed_url', 'social_facebook', 'social_instagram', 'social_whatsapp',
            ]),
        ]);
    }
}
