<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Root route points to login page
Route::get('/', [AuthController::class, 'showLoginForm'])->name('login');
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth');

// Support and ticket form routes, protected by auth and user.only middleware
Route::get('/support', [TicketController::class, 'support'])
    ->middleware(['auth', 'user.only'])
    ->name('support');
Route::get('/TicketForm', [TicketController::class, 'TicketForm'])
    ->middleware(['auth', 'user.only'])
    ->name('ticket.create');
Route::match(['get', 'post'], '/TicketForm', [TicketController::class, 'TicketForm'])
    ->middleware(['auth', 'user.only'])
    ->name('ticket.create');
    Route::get('/messages', [App\Http\Controllers\MessageController::class, 'index']);
    Route::post('/messages/store', [App\Http\Controllers\MessageController::class, 'store']);
    Route::get('/messages/{message}', [App\Http\Controllers\MessageController::class, 'show']);
    Route::put('/messages/{message}', [App\Http\Controllers\MessageController::class, 'update']);
    Route::patch('/messages/{message}', [App\Http\Controllers\MessageController::class, 'update']);
    Route::patch('/messages/{message}/read', [App\Http\Controllers\MessageController::class, 'markAsRead']);
    Route::delete('/messages/{message}', [App\Http\Controllers\MessageController::class, 'destroy']);


// If you want a dedicated route to display the messages page
Route::middleware('auth')->get('/messages/page', function () {
    return view('messages.index');
});

Route::get('/chat/{id}', function ($id) {
    return Inertia::render('MessageField', [
        'userId' => $id
    ]);
});
