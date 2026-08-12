<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SimulationController;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\AdminMiddleware;

// Guest routes
Route::middleware(['guest'])->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

// Authenticated routes
Route::middleware(['auth'])->group(function () {
    Route::get('/', [SimulationController::class, 'index'])->name('simulation.index');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Planning (Accessible by both admin and standard user)
    Route::post('/reagent-plannings', [SimulationController::class, 'storeReagentPlanning'])->name('reagent-plannings.store');
    Route::put('/reagent-plannings/{id}', [SimulationController::class, 'updateReagentPlanning'])->name('reagent-plannings.update');
    Route::delete('/reagent-plannings/{id}', [SimulationController::class, 'destroyReagentPlanning'])->name('reagent-plannings.destroy');
    Route::post('/reagent-plannings/bulk-update', [SimulationController::class, 'bulkUpdateReagentPlanning'])->name('reagent-plannings.bulk-update');

    // API routes for Supabase products
    Route::get('/api/productos/filtros', [SimulationController::class, 'getSupabaseFilters'])->name('productos.filtros');
    Route::get('/api/productos', [SimulationController::class, 'getSupabaseProducts'])->name('productos.index');

    // Admin only routes
    Route::middleware([AdminMiddleware::class])->group(function () {
        Route::post('/simulations', [SimulationController::class, 'store'])->name('simulation.store');
        Route::post('/simulations/calculate', [SimulationController::class, 'calculate'])->name('simulation.calculate');
        Route::post('/equipments', [SimulationController::class, 'storeEquipment'])->name('equipments.store');
        Route::put('/equipments/{id}', [SimulationController::class, 'updateEquipment'])->name('equipments.update');
        Route::delete('/equipments/{id}', [SimulationController::class, 'destroyEquipment'])->name('equipments.destroy');
        Route::delete('/simulations/{id}', [SimulationController::class, 'destroySimulation'])->name('simulations.destroy');

        Route::post('/users', [AuthController::class, 'storeUser'])->name('users.store');
        Route::get('/users', [AuthController::class, 'listUsers'])->name('users.index');
    });
});
