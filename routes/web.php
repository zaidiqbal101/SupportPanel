<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use App\Http\Controllers\TicketController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', [TicketController::class, 'support'])->name('support');
Route::get('/support', [TicketController::class, 'support'])->name('support');
Route::get('/TicketForm', [TicketController::class, 'TicketForm'])->name('ticket.create');
Route::match(['get', 'post'], '/TicketForm', [TicketController::class, 'TicketForm'])->name('ticket.create');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';
