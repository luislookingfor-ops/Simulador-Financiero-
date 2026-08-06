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

Route::post('/reagent-plannings', [SimulationController::class, 'storeReagentPlanning'])->name('reagent-plannings.store');
Route::put('/reagent-plannings/{id}', [SimulationController::class, 'updateReagentPlanning'])->name('reagent-plannings.update');
Route::delete('/reagent-plannings/{id}', [SimulationController::class, 'destroyReagentPlanning'])->name('reagent-plannings.destroy');
Route::post('/reagent-plannings/bulk-update', [SimulationController::class, 'bulkUpdateReagentPlanning'])->name('reagent-plannings.bulk-update');
