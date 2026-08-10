<?php

use App\Http\Controllers\Admin\ActivityController;
use App\Http\Controllers\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MediaItemController;
use App\Http\Controllers\Admin\NewsArticleController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\PoultryTypeController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Public\ContactMessageController;
use App\Http\Controllers\Public\SiteController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Site vitrine (public)
|--------------------------------------------------------------------------
*/
Route::get('/', [SiteController::class, 'home'])->name('home');
Route::get('/a-propos', [SiteController::class, 'about'])->name('about');
Route::get('/races-poussins', [SiteController::class, 'poultry'])->name('poultry.index');
Route::get('/races-poussins/{poultryType:slug}', [SiteController::class, 'poultryShow'])->name('poultry.show');
Route::get('/nos-activites', [SiteController::class, 'activities'])->name('activities');
Route::get('/nos-locaux', [SiteController::class, 'facilities'])->name('facilities');
Route::get('/qualite-biosecurite', [SiteController::class, 'quality'])->name('quality');
Route::get('/galerie', [SiteController::class, 'gallery'])->name('gallery');
Route::get('/actualites', [SiteController::class, 'news'])->name('news.index');
Route::get('/actualites/{article:slug}', [SiteController::class, 'newsShow'])->name('news.show');
Route::get('/faq', [SiteController::class, 'faq'])->name('faq');
Route::get('/contact', [SiteController::class, 'contact'])->name('contact');
Route::post('/contact', [ContactMessageController::class, 'store'])->name('contact.store');

/*
|--------------------------------------------------------------------------
| Authentification (admin unique)
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('/admin/connexion', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/admin/connexion', [AuthenticatedSessionController::class, 'store']);
});
Route::middleware('auth')->post('/admin/deconnexion', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

/*
|--------------------------------------------------------------------------
| Espace admin (protégé)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', DashboardController::class)->name('dashboard');

    Route::get('/reglages', [SettingController::class, 'edit'])->name('settings.edit');
    Route::match(['put', 'post'], '/reglages', [SettingController::class, 'update'])->name('settings.update');

    Route::get('/pages', [PageController::class, 'index'])->name('pages.index');
    Route::get('/pages/{page}', [PageController::class, 'edit'])->name('pages.edit');
    Route::match(['put', 'post'], '/pages/{page}', [PageController::class, 'update'])->name('pages.update');

    Route::resource('types-volailles', PoultryTypeController::class)
        ->parameters(['types-volailles' => 'poultryType'])
        ->names('poultry-types')
        ->except(['show']);

    Route::get('/medias', [MediaItemController::class, 'index'])->name('media.index');
    Route::post('/medias', [MediaItemController::class, 'store'])->name('media.store');
    Route::delete('/medias/{mediaItem}', [MediaItemController::class, 'destroy'])->name('media.destroy');

    Route::get('/activites', [ActivityController::class, 'index'])->name('activities.index');
    Route::post('/activites', [ActivityController::class, 'store'])->name('activities.store');
    Route::put('/activites/{activity}', [ActivityController::class, 'update'])->name('activities.update');
    Route::delete('/activites/{activity}', [ActivityController::class, 'destroy'])->name('activities.destroy');

    Route::get('/temoignages', [TestimonialController::class, 'index'])->name('testimonials.index');
    Route::post('/temoignages', [TestimonialController::class, 'store'])->name('testimonials.store');
    Route::put('/temoignages/{testimonial}', [TestimonialController::class, 'update'])->name('testimonials.update');
    Route::delete('/temoignages/{testimonial}', [TestimonialController::class, 'destroy'])->name('testimonials.destroy');

    Route::get('/actualites', [NewsArticleController::class, 'index'])->name('news.index');
    Route::get('/actualites/creer', [NewsArticleController::class, 'create'])->name('news.create');
    Route::post('/actualites', [NewsArticleController::class, 'store'])->name('news.store');
    Route::get('/actualites/{article}', [NewsArticleController::class, 'edit'])->name('news.edit');
    Route::put('/actualites/{article}', [NewsArticleController::class, 'update'])->name('news.update');
    Route::delete('/actualites/{article}', [NewsArticleController::class, 'destroy'])->name('news.destroy');

    Route::get('/messages', [AdminContactMessageController::class, 'index'])->name('messages.index');
    Route::put('/messages/{message}', [AdminContactMessageController::class, 'update'])->name('messages.update');
    Route::delete('/messages/{message}', [AdminContactMessageController::class, 'destroy'])->name('messages.destroy');
});
