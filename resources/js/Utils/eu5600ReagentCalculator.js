/**
 * EU-5600 Pro Reagent Consumption & HUC Cost Engine
 * Dynamic reactive calculator for both Excel Sheets ("EU-5600Pro" & "consumo de reactivos").
 */

export function calculateEU5600ReagentConsumption(params = {}) {
  const dryChemistryDaily = Number(params.dryChemistryDaily) || 0;
  const sedimentDaily = Number(params.sedimentDaily) || 0;
  const comboDaily = Number(params.comboDaily) || 0;
  const operatingDaysMonth = Number(params.operatingDaysMonth) || 24;

  const priceEu50 = Number(params.priceEu50 !== undefined ? params.priceEu50 : 105);
  const priceStrips11 = Number(params.priceStrips11 !== undefined ? params.priceStrips11 : 90);
  const priceStrips14 = Number(params.priceStrips14 !== undefined ? params.priceStrips14 : 108);
  const priceCleanser = Number(params.priceCleanser !== undefined ? params.priceCleanser : 0);

  const activeStripType = params.activeStripType || 'strips11'; // 'strips11' or 'strips14'

  // Operating Days Year
  const operatingDaysYear = operatingDaysMonth * 12;

  // -------------------------------------------------------------
  // TABLA 2: MATRIZ DE CONSUMO TÉCNICO (consumo de reactivos)
  // -------------------------------------------------------------
  // EU-50 Consumption Breakdown
  const eu50DryConsDay = dryChemistryDaily * 4;
  const eu50DryConsMonth = eu50DryConsDay * operatingDaysMonth;
  const eu50DryConsYear = eu50DryConsDay * operatingDaysYear;

  const eu50SedConsDay = sedimentDaily * 16;
  const eu50SedConsMonth = eu50SedConsDay * operatingDaysMonth;
  const eu50SedConsYear = eu50SedConsDay * operatingDaysYear;

  const eu50ComboConsDay = comboDaily * 16;
  const eu50ComboConsMonth = eu50ComboConsDay * operatingDaysMonth;
  const eu50ComboConsYear = eu50ComboConsDay * operatingDaysYear;

  const eu50BaseDay = eu50DryConsDay + eu50SedConsDay + eu50ComboConsDay;
  const eu50DeadVolDay = eu50BaseDay * 0.05;
  const eu50StartUpDay = 54;
  const eu50ShutDownDay = 70;

  const eu50TotalDayMl = eu50BaseDay + eu50DeadVolDay + eu50StartUpDay + eu50ShutDownDay;
  const eu50TotalMonthMl = eu50TotalDayMl * operatingDaysMonth;
  const eu50TotalYearMl = eu50TotalDayMl * operatingDaysYear;

  // Frasco/mes and Frasco/año (Sheet 2)
  const eu50FrascoMesTecnico = eu50TotalMonthMl / 5000;
  const eu50FrascoAnoTecnico = eu50TotalYearMl / 5000;

  // Strips Consumption (Used in Dry Chem + Sediments + Combo)
  const stripsDaily = dryChemistryDaily + sedimentDaily + comboDaily;
  const stripsMonth = stripsDaily * operatingDaysMonth;
  const stripsYear = stripsDaily * operatingDaysYear;

  const stripsFrascoMesTecnico = stripsMonth / 100;
  const stripsFrascoAnoTecnico = stripsYear / 100;

  // Cleanser
  const cleanserShutDownDay = 6;

  // -------------------------------------------------------------
  // TABLA 1: ENVASE DE REACTIVOS (EU-5600Pro)
  // -------------------------------------------------------------
  // EU-50
  const eu50BotellaMesTabla1 = Number(eu50FrascoMesTecnico.toFixed(1));
  const eu50BotellaAnoTabla1 = Number(eu50FrascoAnoTecnico.toFixed(1));
  const eu50CaducidadAnoTabla1 = 4.0; // Min bottles for 90-day open stability
  const eu50BotellaAnoFinal = Math.max(eu50BotellaAnoTabla1, eu50CaducidadAnoTabla1);
  const eu50EnvaseAnoTabla1 = Math.ceil(eu50BotellaAnoFinal / 2);

  // URS-Strips(11 items)
  const strips11BotellaMesTabla1 = Number(stripsFrascoMesTecnico.toFixed(1));
  const strips11BotellaAnoTabla1 = Number(stripsFrascoAnoTecnico.toFixed(1));
  const strips11EnvaseAnoTabla1 = Math.ceil(strips11BotellaAnoTabla1 / 10);

  // URS-Strips(14 items)
  const strips14BotellaMesTabla1 = Number(stripsFrascoMesTecnico.toFixed(1));
  const strips14BotellaAnoTabla1 = Number(stripsFrascoAnoTecnico.toFixed(1));
  const strips14EnvaseAnoTabla1 = Math.ceil(strips14BotellaAnoTabla1 / 10);

  // Cost calculations
  const costFobEu50 = eu50EnvaseAnoTabla1 * priceEu50;
  const costFobStrips11 = strips11EnvaseAnoTabla1 * priceStrips11;
  const costFobStrips14 = strips14EnvaseAnoTabla1 * priceStrips14;

  const activeStripsCostFob = activeStripType === 'strips14' ? costFobStrips14 : costFobStrips11;
  const totalCostFobYear = costFobEu50 + activeStripsCostFob;

  const totalTestsYear = (dryChemistryDaily + sedimentDaily + comboDaily) * operatingDaysYear;
  const costPerTestFob = totalTestsYear > 0 ? (totalCostFobYear / totalTestsYear) : 0;

  return {
    dias_operacion_mes: operatingDaysMonth,
    dias_operacion_ano: operatingDaysYear,
    tabla1: {
      quimica_seca_dia: dryChemistryDaily,
      sedimentos_dia: sedimentDaily,
      combo_dia: comboDaily,
      dias_mes: operatingDaysMonth,
      dias_ano: operatingDaysYear,
      costo_prueba_fob: costPerTestFob,
      eu50: {
        precio: priceEu50,
        botella_mes: eu50BotellaMesTabla1,
        botella_ano: eu50BotellaAnoTabla1,
        botella_caducidad: eu50CaducidadAnoTabla1,
        envase_ano: eu50EnvaseAnoTabla1
      },
      strips11: {
        precio: priceStrips11,
        botella_mes: strips11BotellaMesTabla1,
        botella_ano: strips11BotellaAnoTabla1,
        botella_caducidad: "/",
        envase_ano: strips11EnvaseAnoTabla1
      },
      strips14: {
        precio: priceStrips14,
        botella_mes: strips14BotellaMesTabla1,
        botella_ano: strips14BotellaAnoTabla1,
        botella_caducidad: "/",
        envase_ano: strips14EnvaseAnoTabla1
      },
      cleanser: {
        precio: priceCleanser,
        botella_mes: "",
        botella_ano: "",
        botella_caducidad: "",
        envase_ano: ""
      }
    },
    tabla2: {
      dias_mes: operatingDaysMonth,
      dias_ano: operatingDaysYear,
      eu50: {
        dry: { dia: dryChemistryDaily, ml_sample: 4, cons_dia: eu50DryConsDay, cons_mes: eu50DryConsMonth, cons_ano: eu50DryConsYear },
        sed: { dia: sedimentDaily, ml_sample: 16, cons_dia: eu50SedConsDay, cons_mes: eu50SedConsMonth, cons_ano: eu50SedConsYear },
        combo: { dia: comboDaily, ml_sample: 16, cons_dia: eu50ComboConsDay, cons_mes: eu50ComboConsMonth, cons_ano: eu50ComboConsYear },
        volumen_muerto: "5%",
        start_up: 54,
        shut_down: 70,
        especificacion_frasco: 5000,
        frasco_mes: eu50FrascoMesTecnico.toFixed(1),
        frasco_ano: eu50FrascoAnoTecnico.toFixed(1)
      },
      strips: {
        dia: stripsDaily,
        ml_sample: 1,
        cons_dia: stripsDaily,
        cons_mes: stripsMonth,
        cons_ano: stripsYear,
        volumen_muerto: "0%",
        start_up: 0,
        shut_down: 0,
        especificacion_frasco: 100,
        frasco_mes: stripsFrascoMesTecnico.toFixed(1),
        frasco_ano: stripsFrascoAnoTecnico.toFixed(1)
      },
      cleanser: {
        shut_down: 6
      }
    }
  };
}
