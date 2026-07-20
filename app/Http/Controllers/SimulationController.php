<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\Simulation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SimulationController extends Controller
{
    public function index()
    {
        $equipments = [];
        try {
            $equipments = Equipment::all();
        } catch (\Exception $e) {
            // Fail silently and use mock fallback
        }
        
        if (empty($equipments) || count($equipments) === 0) {
            $equipments = $this->getMockEquipments();
        }
        
        $simulations = [];
        try {
            $simulations = Simulation::orderBy('created_at', 'desc')->get();
        } catch (\Exception $e) {
            // Fail silently
        }

        return Inertia::render('SimulationForm', [
            'equipments' => $equipments,
            'simulations' => $simulations,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'global_settings' => 'required|array',
            'equipment_settings' => 'required|array',
        ]);

        try {
            $simulation = Simulation::create($validated);
        } catch (\Exception $e) {
            // In case of database error in local dev mock
            return redirect()->back()->with('error', 'Error al guardar en base de datos: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Simulación guardada correctamente.');
    }

    public function calculate(Request $request)
    {
        $global = $request->input('global_settings');
        $configs = $request->input('equipment_settings');
        
        $contractMonths = (int) ($global['contract_months'] ?? $global['months'] ?? 36);
        $amortizationMonths = (int) ($global['amortization_months'] ?? $global['months'] ?? 36);
        $annualInterest = (float) ($global['interest_rate'] ?? 11) / 100;
        $annualInflation = (float) ($global['inflation_rate'] ?? 1) / 100;
        $importIndex = (float) ($global['import_index'] ?? 1.15);

        $results = [];

        foreach ($configs as $index => $cfg) {
            if (empty($cfg['equipment_id'])) {
                $results[$index] = null;
                continue;
            }

            $eq = null;
            try {
                $eq = Equipment::find($cfg['equipment_id']);
            } catch (\Exception $e) {
                // Database not available
            }

            if (!$eq) {
                $mockList = $this->getMockEquipments();
                foreach ($mockList as $m) {
                    if ($m['id'] == $cfg['equipment_id']) {
                        $eq = (object) $m;
                        break;
                    }
                }
            }

            if (!$eq) {
                $results[$index] = null;
                continue;
            }

            $qty = (int) ($cfg['quantity'] ?? 1);
            
            // Accessories and optional flags
            $hasUPS = (bool) ($cfg['include_ups'] ?? true);
            $hasPC = (bool) ($cfg['include_pc'] ?? true);
            $hasPrinterBase = (bool) ($cfg['include_printer_base'] ?? true);
            $hasZebra = (bool) ($cfg['include_zebra'] ?? false);
            $hasSoftware = (bool) ($cfg['include_software'] ?? false);
            $softwareVal = (float) ($cfg['software_value'] ?? 2000);
            $hasSyringes = (bool) ($cfg['include_syringes'] ?? false);
            $hasControls = (bool) ($cfg['include_controls'] ?? false);

            $upsCost = $hasUPS ? (float) $eq->ups : 0;
            $pcCost = $hasPC ? (float) $eq->pc : 0;
            $printerBaseCost = $hasPrinterBase ? (float) $eq->impresora : 0;
            $zebraCost = $hasZebra ? 330.00 : 0;
            $softwareCost = $hasSoftware ? $softwareVal : 0;
            $syringesCost = $hasSyringes ? 150.00 : 0;
            $controlCost = $hasControls ? (float) $eq->control : 0;
            $calibratorCost = $hasControls ? (float) $eq->calibrador : 0;

            // LANDED TEORICO
            $fobTotalSelected = $eq->fob + $upsCost + $pcCost + $printerBaseCost + $zebraCost + $softwareCost + $syringesCost + $controlCost + $calibratorCost;
            $landedTeorico = $fobTotalSelected * $importIndex;

            // LANDED REAL
            $fobTotalBase = $eq->fob + (float) $eq->ups + (float) $eq->pc + (float) $eq->impresora + (float) $eq->control + (float) $eq->calibrador;
            $landedReal = $fobTotalBase * $importIndex;

            // AMORTIZACIÓN (PMT)
            $pv = $landedTeorico * $qty;
            $r = $annualInterest / 12;
            $n = $amortizationMonths;

            if ($r > 0) {
                $pmt = ($pv * $r) / (1 - pow(1 + $r, -$n));
            } else {
                $pmt = $n > 0 ? ($pv / $n) : 0;
            }

            // VOLUMETRÍA
            $dailyTests = (int) ($cfg['daily_tests'] ?? 0);
            $monthlyTests = $dailyTests * 30;
            $annualTests = $monthlyTests * 12;
            $totalTests = $monthlyTests * $contractMonths;

            $pvp = (float) ($cfg['pvp_per_test'] ?? 1.10);
            $totalRevenue = $totalTests * $pvp;

            // REAGENTS & OPERATING COSTS WITH INFLATION
            $baseReagentCost = (float) ($cfg['reagent_cost_per_test'] ?? $eq->default_reagent_cost ?? 0.35);
            
            $totalReagentCost = 0;
            $monthlyTestsPerEq = $monthlyTests;
            
            for ($mIdx = 1; $mIdx <= $contractMonths; $mIdx++) {
                $yearIdx = (int) (($mIdx - 1) / 12);
                $inflatedReagentCost = $baseReagentCost * pow(1 + $annualInflation, $yearIdx);
                $totalReagentCost += ($monthlyTestsPerEq * $qty) * $inflatedReagentCost;
            }

            $grossProfitUSD = $totalRevenue - $totalReagentCost;
            $grossProfitPercent = $totalRevenue > 0 ? ($grossProfitUSD / $totalRevenue) * 100 : 0;

            $totalAmortization = $pmt * $contractMonths;
            $netProfitUSD = $grossProfitUSD - $totalAmortization;
            $netProfitPercent = $totalRevenue > 0 ? ($netProfitUSD / $totalRevenue) * 100 : 0;

            // Break-even Minimum Monthly Consumption (Revenue) in USD
            $avgReagentCost = $totalTests > 0 ? $totalReagentCost / $totalTests : $baseReagentCost;
            $marginRatio = $pvp > 0 ? (1 - ($avgReagentCost / $pvp)) : 0;
            $minMonthlyConsumption = ($marginRatio > 0) ? ($pmt / $marginRatio) : 0;

            // Cost of equipment per test
            $costPerTest = $monthlyTests > 0 ? ($pmt / ($monthlyTests * $qty)) : 0;

            $results[$index] = [
                'landed_teorico_unit' => $landedTeorico,
                'landed_teorico_total' => $landedTeorico * $qty,
                'landed_real_unit' => $landedReal,
                'landed_real_total' => $landedReal * $qty,
                'monthly_amortization' => $pmt,
                'total_amortization' => $totalAmortization,
                'cost_per_test' => $costPerTest,
                'volumetrics' => [
                    'monthly_tests' => $monthlyTests * $qty,
                    'annual_tests' => $annualTests * $qty,
                    'total_tests' => $totalTests,
                ],
                'p_and_l' => [
                    'total_revenue' => $totalRevenue,
                    'gross_profit_usd' => $grossProfitUSD,
                    'gross_profit_percent' => $grossProfitPercent,
                    'net_profit_usd' => $netProfitUSD,
                    'net_profit_percent' => $netProfitPercent,
                    'min_monthly_consumption' => $minMonthlyConsumption,
                ]
            ];
        }

        return response()->json($results);
    }

    private function getMockEquipments()
    {
        return [
            // Hematología
            ['id' => 1, 'code' => 'KT-6610', 'name' => 'KT 6610', 'fob' => 0, 'ups' => 0, 'pc' => 0, 'impresora' => 0, 'control' => 0, 'calibrador' => 0, 'line' => 'Hematología', 'default_reagent_cost' => 0.35],
            ['id' => 2, 'code' => 'KT-8000', 'name' => 'KT 8000', 'fob' => 0, 'ups' => 0, 'pc' => 0, 'impresora' => 0, 'control' => 0, 'calibrador' => 0, 'line' => 'Hematología', 'default_reagent_cost' => 0.40],
            ['id' => 3, 'code' => 'F-560', 'name' => 'F560', 'fob' => 0, 'ups' => 0, 'pc' => 0, 'impresora' => 0, 'control' => 0, 'calibrador' => 0, 'line' => 'Hematología', 'default_reagent_cost' => 0.45],
            ['id' => 4, 'code' => 'F-810', 'name' => 'F810', 'fob' => 0, 'ups' => 0, 'pc' => 0, 'impresora' => 0, 'control' => 0, 'calibrador' => 0, 'line' => 'Hematología', 'default_reagent_cost' => 0.50],
            ['id' => 5, 'code' => 'MND-3008B-CTO-S01', 'name' => 'CONTADOR HEMATOLOGICO BC-20S', 'fob' => 2111, 'ups' => 87.40, 'pc' => 0.00, 'impresora' => 272.32, 'control' => 52.98, 'calibrador' => 100.30, 'line' => 'Hematología', 'default_reagent_cost' => 0.35],
            ['id' => 6, 'code' => 'MND-3008B-CTO-S02', 'name' => 'CONTADOR HEMATOLOGICO BC-30S', 'fob' => 3297, 'ups' => 87.40, 'pc' => 0.00, 'impresora' => 272.32, 'control' => 52.98, 'calibrador' => 100.30, 'line' => 'Hematología', 'default_reagent_cost' => 0.35],
            ['id' => 7, 'code' => 'MND-3107B-CTO-S01', 'name' => 'CONTADOR HEMATOLOGICO BC-5000', 'fob' => 4401, 'ups' => 87.40, 'pc' => 0.00, 'impresora' => 272.32, 'control' => 50.57, 'calibrador' => 100.30, 'line' => 'Hematología', 'default_reagent_cost' => 0.45],
            ['id' => 8, 'code' => 'MND-3107B-CTO-S02', 'name' => 'CONTADOR HEMATOLOGICO BC-5150', 'fob' => 6259, 'ups' => 87.40, 'pc' => 0.00, 'impresora' => 272.32, 'control' => 50.57, 'calibrador' => 100.30, 'line' => 'Hematología', 'default_reagent_cost' => 0.45],
            ['id' => 9, 'code' => 'MND-3101B-CTO-S01', 'name' => 'CONTADOR HEMATOLOGICO BC-5300', 'fob' => 7500, 'ups' => 662.57, 'pc' => 616.16, 'impresora' => 272.32, 'control' => 50.57, 'calibrador' => 100.30, 'line' => 'Hematología', 'default_reagent_cost' => 0.50],
            ['id' => 10, 'code' => 'MND-3102B-CTO-S01', 'name' => 'CONTADOR HEMATOLOGICO BC-5380', 'fob' => 8063.95, 'ups' => 662.57, 'pc' => 616.16, 'impresora' => 272.32, 'control' => 50.57, 'calibrador' => 100.30, 'line' => 'Hematología', 'default_reagent_cost' => 0.50],
            ['id' => 11, 'code' => 'MND-3206B-CTO-S01', 'name' => 'CONTADOR HEMATOLOGICO BC-6000', 'fob' => 15000, 'ups' => 746.33, 'pc' => 559.54, 'impresora' => 272.32, 'control' => 150.89, 'calibrador' => 100.30, 'line' => 'Hematología', 'default_reagent_cost' => 0.60],
            ['id' => 12, 'code' => 'MND-3206B-CTO-S02', 'name' => 'CONTADOR HEMATOLOGICO BC-6200', 'fob' => 19000, 'ups' => 746.33, 'pc' => 559.54, 'impresora' => 272.32, 'control' => 150.89, 'calibrador' => 100.30, 'line' => 'Hematología', 'default_reagent_cost' => 0.60],
            ['id' => 13, 'code' => 'MND-3201B-CTO-S01', 'name' => 'CONTADOR HEMATOLOGICO BC-6800', 'fob' => 25000, 'ups' => 746.33, 'pc' => 559.54, 'impresora' => 272.32, 'control' => 150.89, 'calibrador' => 100.30, 'line' => 'Hematología', 'default_reagent_cost' => 0.65],
            ['id' => 14, 'code' => 'MND-3205B-PA00010', 'name' => 'CONTADOR HEMATOLOGICO BC-6800PLUS', 'fob' => 23250, 'ups' => 746.33, 'pc' => 559.54, 'impresora' => 272.32, 'control' => 150.89, 'calibrador' => 100.30, 'line' => 'Hematología', 'default_reagent_cost' => 0.65],

            // Química
            ['id' => 15, 'code' => 'TC-M160', 'name' => 'TECO MATRIX 160', 'fob' => 0, 'ups' => 0, 'pc' => 0, 'impresora' => 0, 'control' => 0, 'calibrador' => 0, 'line' => 'Química', 'default_reagent_cost' => 0.25],
            ['id' => 16, 'code' => 'TC-M240', 'name' => 'TECO MATRIX 240', 'fob' => 0, 'ups' => 0, 'pc' => 0, 'impresora' => 0, 'control' => 0, 'calibrador' => 0, 'line' => 'Química', 'default_reagent_cost' => 0.25],
            ['id' => 17, 'code' => 'TC-M480', 'name' => 'TECO MATRIX 480', 'fob' => 0, 'ups' => 0, 'pc' => 0, 'impresora' => 0, 'control' => 0, 'calibrador' => 0, 'line' => 'Química', 'default_reagent_cost' => 0.25],
            ['id' => 18, 'code' => 'MND-BS240', 'name' => 'BS-240 ANALIZADOR DE QUÍMICA CLÍNICA', 'fob' => 0, 'ups' => 0, 'pc' => 0, 'impresora' => 0, 'control' => 0, 'calibrador' => 0, 'line' => 'Química', 'default_reagent_cost' => 0.25],
            ['id' => 19, 'code' => 'MND-BS430', 'name' => 'BS-430 ANALIZADOR DE QUÍMICA CLÍNICA', 'fob' => 0, 'ups' => 0, 'pc' => 0, 'impresora' => 0, 'control' => 0, 'calibrador' => 0, 'line' => 'Química', 'default_reagent_cost' => 0.25],

            // Inmunología
            ['id' => 20, 'code' => 'LFT-E8000', 'name' => 'LIFOTRONIC ECLIA 8000', 'fob' => 0, 'ups' => 0, 'pc' => 0, 'impresora' => 0, 'control' => 0, 'calibrador' => 0, 'line' => 'Inmunología', 'default_reagent_cost' => 1.10],
            ['id' => 21, 'code' => 'LFT-E8600', 'name' => 'LIFOTRONIC ECLIA 8600', 'fob' => 0, 'ups' => 0, 'pc' => 0, 'impresora' => 0, 'control' => 0, 'calibrador' => 0, 'line' => 'Inmunología', 'default_reagent_cost' => 1.10],
            ['id' => 22, 'code' => 'LFT-E9000', 'name' => 'LIFOTRONIC ECLIA 9000', 'fob' => 0, 'ups' => 0, 'pc' => 0, 'impresora' => 0, 'control' => 0, 'calibrador' => 0, 'line' => 'Inmunología', 'default_reagent_cost' => 1.10],
            ['id' => 23, 'code' => 'YHLO-C6104', 'name' => 'iFLASH 1800A YHLO ANALIZADOR DE INMUNOENSAYO CLIA', 'fob' => 19023, 'ups' => 746.33, 'pc' => 559.54, 'impresora' => 272.32, 'control' => 0, 'calibrador' => 0, 'line' => 'Inmunología', 'default_reagent_cost' => 1.20],

            // Gasometría
            ['id' => 24, 'code' => 'EDAN-GAS', 'name' => 'Edan', 'fob' => 0, 'ups' => 0, 'pc' => 0, 'impresora' => 0, 'control' => 0, 'calibrador' => 0, 'line' => 'Gasometría', 'default_reagent_cost' => 0.80],
            ['id' => 25, 'code' => 'SEAMATY-GAS', 'name' => 'Seamaty', 'fob' => 0, 'ups' => 0, 'pc' => 0, 'impresora' => 0, 'control' => 0, 'calibrador' => 0, 'line' => 'Gasometría', 'default_reagent_cost' => 0.80],

            // Electrolitos
            ['id' => 26, 'code' => 'HRN-H900', 'name' => 'HORRON H900', 'fob' => 0, 'ups' => 0, 'pc' => 0, 'impresora' => 0, 'control' => 0, 'calibrador' => 0, 'line' => 'Electrolitos', 'default_reagent_cost' => 0.50],
            ['id' => 27, 'code' => 'BSN-BE900', 'name' => 'BIOSENS BE900', 'fob' => 0, 'ups' => 0, 'pc' => 0, 'impresora' => 0, 'control' => 0, 'calibrador' => 0, 'line' => 'Electrolitos', 'default_reagent_cost' => 0.50],

            // Uroanálisis
            ['id' => 28, 'code' => 'MND-EU5300P', 'name' => 'MINDRAY EU-5300 PRO', 'fob' => 0, 'ups' => 0, 'pc' => 0, 'impresora' => 0, 'control' => 0, 'calibrador' => 0, 'line' => 'Uroanálisis', 'default_reagent_cost' => 0.30],
            ['id' => 29, 'code' => 'MND-EU5600P', 'name' => 'MINDRAY EU-5600 PRO', 'fob' => 0, 'ups' => 0, 'pc' => 0, 'impresora' => 0, 'control' => 0, 'calibrador' => 0, 'line' => 'Uroanálisis', 'default_reagent_cost' => 0.30],

            // Coagulación
            ['id' => 30, 'code' => 'BE-018-016', 'name' => 'COAGULOMETRO THROMBOLYZER COMPACT X AUTO.', 'fob' => 10988, 'ups' => 519.48, 'pc' => 616.16, 'impresora' => 272.32, 'control' => 0, 'calibrador' => 0, 'line' => 'Coagulación', 'default_reagent_cost' => 0.70],
            ['id' => 31, 'code' => 'BE-018-028', 'name' => 'COAGULOMETRO THROMBOLYZER XRC CON ACCESORIOS', 'fob' => 17570, 'ups' => 519.48, 'pc' => 616.16, 'impresora' => 272.32, 'control' => 0, 'calibrador' => 0, 'line' => 'Coagulación', 'default_reagent_cost' => 0.70],

            // HPLC
            ['id' => 32, 'code' => 'LFT-008', 'name' => 'ANALIZADOR HBA1C HPLC H-9 LIFOTRONIC', 'fob' => 8700, 'ups' => 519.48, 'pc' => 0, 'impresora' => 0, 'control' => 0, 'calibrador' => 0, 'line' => 'HPLC', 'default_reagent_cost' => 0.80],
            ['id' => 33, 'code' => 'LFT-014', 'name' => 'ANALIZADOR HbA1c HPLC H8 LIFOTRONIC', 'fob' => 7350, 'ups' => 519.48, 'pc' => 0, 'impresora' => 0, 'control' => 0, 'calibrador' => 0, 'line' => 'HPLC', 'default_reagent_cost' => 0.80]
        ];
    }
}
