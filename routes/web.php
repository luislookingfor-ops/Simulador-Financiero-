<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SimulationController;

Route::get('/', [SimulationController::class, 'index'])->name('simulation.index');
Route::post('/simulations', [SimulationController::class, 'store'])->name('simulation.store');
Route::post('/simulations/calculate', [SimulationController::class, 'calculate'])->name('simulation.calculate');
