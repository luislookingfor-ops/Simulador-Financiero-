<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SimulationController;

Route::get('/', [SimulationController::class, 'index'])->name('simulation.index');
Route::post('/simulations', [SimulationController::class, 'store'])->name('simulation.store');
Route::post('/simulations/calculate', [SimulationController::class, 'calculate'])->name('simulation.calculate');

Route::post('/equipments', [SimulationController::class, 'storeEquipment'])->name('equipments.store');
Route::put('/equipments/{id}', [SimulationController::class, 'updateEquipment'])->name('equipments.update');
Route::delete('/equipments/{id}', [SimulationController::class, 'destroyEquipment'])->name('equipments.destroy');
Route::delete('/simulations/{id}', [SimulationController::class, 'destroySimulation'])->name('simulations.destroy');
