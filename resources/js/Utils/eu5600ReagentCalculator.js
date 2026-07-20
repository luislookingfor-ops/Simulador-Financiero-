/**
 * EU-5600 Pro Reagent Consumption & HUC Cost Engine
 * Calculates daily/monthly/annual reagent volume, packaging units, and cost per test.
 */

export function calculateEU5600ReagentConsumption(params = {}) {
  const {
    dryChemistryDaily = 100,
    sedimentDaily = 100,
    comboDaily = 100,
    operatingDaysMonth = 24,
    stripType = 'strips11', // 'strips11' or 'strips14'
    importIndex = 1.15
  } = params;

  const operatingDaysYear = operatingDaysMonth * 12;

  // Total Tests Volumetrics
  const totalTestsDaily = Number(dryChemistryDaily) + Number(sedimentDaily) + Number(comboDaily);
  const totalTestsMonthly = totalTestsDaily * operatingDaysMonth;
  const totalTestsAnnual = totalTestsDaily * operatingDaysYear;

  // -------------------------------------------------------------
  // 1. EU-50 Reagent (Liquid Reagent for Dry Chem & Sediment)
  // -------------------------------------------------------------
  const eu50DryMl = Number(dryChemistryDaily) * 4;
  const eu50SedMl = Number(sedimentDaily) * 16;
  const eu50ComboMl = Number(comboDaily) * 16;
  const eu50BaseMlDaily = eu50DryMl + eu50SedMl + eu50ComboMl;

  // Add 5% dead volume + 54ml start-up + 70ml shut-down
  const eu50DailyMl = (eu50BaseMlDaily * 1.05) + 54 + 70;
  const eu50MonthlyMl = eu50DailyMl * operatingDaysMonth;
  const eu50AnnualMl = eu50DailyMl * operatingDaysYear;

  // Bottle Specs: 5000ml per bottle, 2 bottles per package
  const eu50BottlesMonth = eu50MonthlyMl / 5000;
  const eu50BottlesYearLinear = eu50AnnualMl / 5000;
  // Expiration constraint: EU-50 open stability = 90 days. Min frascos = Math.ceil(365 / 90) = 4 bottles/year
  const eu50BottlesYearExpiration = Math.ceil(365 / 90);
  const eu50BottlesYearFinal = Math.max(eu50BottlesYearLinear, eu50BottlesYearExpiration);
  
  // Package count (2 bottles per package) - ceiling to next integer
  const eu50PackagesYear = Math.ceil(eu50BottlesYearFinal / 2);
  const eu50PackageFob = 105.00;
  const eu50TotalFobYear = eu50PackagesYear * eu50PackageFob;
  const eu50TotalLandedYear = eu50TotalFobYear * importIndex;

  // -------------------------------------------------------------
  // 2. URS-Strips (11 items or 14 items)
  // -------------------------------------------------------------
  // Strips are used in Dry Chemistry and Combo tests (1 strip per sample)
  const stripsDaily = Number(dryChemistryDaily) + Number(comboDaily);
  const stripsMonthly = stripsDaily * operatingDaysMonth;
  const stripsAnnual = stripsDaily * operatingDaysYear;

  // Can Specs: 100 strips per can, 10 cans per package (1,000 strips/package)
  const stripsCansMonth = stripsMonthly / 100;
  const stripsCansYear = stripsAnnual / 100;
  const stripsPackagesYear = Math.ceil(stripsCansYear / 10);

  const isStrips14 = stripType === 'strips14';
  const stripPartNumber = isStrips14 ? '105-035297-00' : '105-035331-00';
  const stripName = isStrips14 ? 'URS-Strips (14 items)' : 'URS-Strips (11 items)';
  const stripPackageFob = isStrips14 ? 108.00 : 90.00;

  const stripsTotalFobYear = stripsPackagesYear * stripPackageFob;
  const stripsTotalLandedYear = stripsTotalFobYear * importIndex;

  // -------------------------------------------------------------
  // 3. Cleanser
  // -------------------------------------------------------------
  const cleanserShutDownMlDaily = 6;
  const cleanserMonthlyMl = cleanserShutDownMlDaily * operatingDaysMonth;
  const cleanserAnnualMl = cleanserShutDownMlDaily * operatingDaysYear;

  // -------------------------------------------------------------
  // Summary & Cost per Test
  // -------------------------------------------------------------
  const totalReagentsFobYear = eu50TotalFobYear + stripsTotalFobYear;
  const totalReagentsLandedYear = eu50TotalLandedYear + stripsTotalLandedYear;

  const costPerTestFob = totalTestsAnnual > 0 ? (totalReagentsFobYear / totalTestsAnnual) : 0;
  const costPerTestLanded = totalTestsAnnual > 0 ? (totalReagentsLandedYear / totalTestsAnnual) : 0;

  return {
    resumen_volumetria: {
      dry_chemistry_daily: Number(dryChemistryDaily),
      sediment_daily: Number(sedimentDaily),
      combo_daily: Number(comboDaily),
      total_pruebas_dia: totalTestsDaily,
      total_pruebas_mes: totalTestsMonthly,
      total_pruebas_ano: totalTestsAnnual,
      dias_operacion_mes: operatingDaysMonth,
      dias_operacion_ano: operatingDaysYear,
      costo_promedio_reactivo_por_prueba_fob: costPerTestFob,
      costo_promedio_reactivo_por_prueba_landed: costPerTestLanded,
      total_gasto_reactivos_fob_ano: totalReagentsFobYear,
      total_gasto_reactivos_landed_ano: totalReagentsLandedYear
    },
    detalle_reactivos: [
      {
        item: "EU-50",
        part_number: "105-039227-A0",
        especificacion_empaque: "2 bottle/package",
        consumo_diario_ml: eu50DailyMl,
        consumo_mensual_ml: eu50MonthlyMl,
        consumo_anual_ml: eu50AnnualMl,
        frascos_mes: Number(eu50BottlesMonth.toFixed(1)),
        frascos_ano_calculo: Number(eu50BottlesYearLinear.toFixed(1)),
        frascos_ano_caducidad: eu50BottlesYearExpiration,
        frascos_ano_final: Number(eu50BottlesYearFinal.toFixed(1)),
        empaques_comprar_ano: eu50PackagesYear,
        precio_empaque_fob: eu50PackageFob,
        costo_fob_total_ano: eu50TotalFobYear,
        costo_landed_total_ano: eu50TotalLandedYear
      },
      {
        item: stripName,
        part_number: stripPartNumber,
        especificacion_empaque: "10 can/package",
        consumo_diario_tiras: stripsDaily,
        consumo_mensual_tiras: stripsMonthly,
        consumo_anual_tiras: stripsAnnual,
        frascos_mes: Number(stripsCansMonth.toFixed(1)),
        frascos_ano_calculo: Number(stripsCansYear.toFixed(1)),
        frascos_ano_caducidad: null,
        frascos_ano_final: Number(stripsCansYear.toFixed(1)),
        empaques_comprar_ano: stripsPackagesYear,
        precio_empaque_fob: stripPackageFob,
        costo_fob_total_ano: stripsTotalFobYear,
        costo_landed_total_ano: stripsTotalLandedYear
      },
      {
        item: "Cleanser",
        part_number: "/",
        especificacion_empaque: "Preparado por cliente final",
        consumo_diario_ml: cleanserShutDownMlDaily,
        consumo_mensual_ml: cleanserMonthlyMl,
        consumo_anual_ml: cleanserAnnualMl,
        frascos_mes: 0,
        frascos_ano_calculo: 0,
        frascos_ano_caducidad: null,
        frascos_ano_final: 0,
        empaques_comprar_ano: 0,
        precio_empaque_fob: 0.00,
        costo_fob_total_ano: 0.00,
        costo_landed_total_ano: 0.00
      }
    ]
  };
}
