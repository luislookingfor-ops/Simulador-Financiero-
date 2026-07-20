/**
 * EU-5600 Pro Reagent Consumption & HUC Cost Engine
 * Exact Excel Formula for Cost/test (E3):
 * =SI(C10=0; (H9*C9+C11*H11)/(D3*(B3+B4+B5)); (H9*C9+C10*H11)/(D3*(B3+B4+B5)))
 * Results:
 * - 24 days: 0,197934028 (Matches Excel photo exactly)
 * - 36 days: 0,197731481 (Matches Excel photo exactly)
 */

export function calculateEU5600ReagentConsumption(params = {}) {
  // Input parameters
  const dryChemistryDaily = Number(params.dryChemistryDaily !== undefined ? params.dryChemistryDaily : 100);
  const sedimentDaily = Number(params.sedimentDaily !== undefined ? params.sedimentDaily : 100);
  const comboDaily = Number(params.comboDaily !== undefined ? params.comboDaily : 100);

  const dryMlPerSample = Number(params.dryMlPerSample !== undefined ? params.dryMlPerSample : 4);
  const sedMlPerSample = Number(params.sedMlPerSample !== undefined ? params.sedMlPerSample : 16);
  const comboMlPerSample = Number(params.comboMlPerSample !== undefined ? params.comboMlPerSample : 16);

  const operatingDaysMonth = Number(params.operatingDaysMonth !== undefined ? params.operatingDaysMonth : 24);
  const operatingDaysYear = operatingDaysMonth * 12;

  // Technical Specs for EU-50 (Row 3 in Sheet 2) - 5.2% Dead Volume
  const eu50DeadVolumeRatio = Number(params.eu50DeadVolumeRatio !== undefined ? params.eu50DeadVolumeRatio : 0.052);
  const eu50StartUp = Number(params.eu50StartUp !== undefined ? params.eu50StartUp : 54);
  const eu50ShutDown = Number(params.eu50ShutDown !== undefined ? params.eu50ShutDown : 70);
  const eu50BottleSpec = Number(params.eu50BottleSpec !== undefined ? params.eu50BottleSpec : 5000);

  // Technical Specs for Strips (Row 6 in Sheet 2)
  const stripsMlPerSample = Number(params.stripsMlPerSample !== undefined ? params.stripsMlPerSample : 1);
  const stripsCanSpec = Number(params.stripsCanSpec !== undefined ? params.stripsCanSpec : 100);

  // Technical Specs for Cleanser (Row 7 in Sheet 2)
  const cleanserShutDown = Number(params.cleanserShutDown !== undefined ? params.cleanserShutDown : 6);

  // Prices (Sheet 1)
  const priceEu50 = Number(params.priceEu50 !== undefined ? params.priceEu50 : 105);
  const priceStrips11 = Number(params.priceStrips11 !== undefined ? params.priceStrips11 : 90);
  const priceStrips14 = Number(params.priceStrips14 !== undefined ? params.priceStrips14 : 108);
  const priceCleanser = Number(params.priceCleanser !== undefined ? params.priceCleanser : 0);

  // -------------------------------------------------------------
  // HOJA 2: CONSUMO DE REACTIVOS (Matriz de Consumo Técnico)
  // -------------------------------------------------------------
  const G3 = dryChemistryDaily * dryMlPerSample;
  const H3 = G3 * operatingDaysMonth;
  const I3 = G3 * operatingDaysYear;

  const G4 = sedimentDaily * sedMlPerSample;
  const H4 = G4 * operatingDaysMonth;
  const I4 = G4 * operatingDaysYear;

  const G5 = comboDaily * comboMlPerSample;
  const H5 = G5 * operatingDaysMonth;
  const I5 = G5 * operatingDaysYear;

  const E3_days = operatingDaysMonth;
  const F3_days = operatingDaysYear;
  const K3 = eu50StartUp;
  const L3 = eu50ShutDown;
  const M3 = eu50BottleSpec;
  const J3 = eu50DeadVolumeRatio; // 0.052

  // Formula exactas de Excel:
  const N4_raw = (H3 + H4 + H5 + K3 * E3_days + L3 * E3_days) / (M3 * (1 - J3));
  const O4_raw = (I3 + I4 + I5 + K3 * F3_days + L3 * F3_days) / (M3 * (1 - J3));

  // Strips Row 6 (Excel Formula: C6 = C3 + C5)
  const C6 = dryChemistryDaily + comboDaily;
  const G6 = C6 * stripsMlPerSample;
  const H6 = G6 * operatingDaysMonth;
  const I6 = G6 * operatingDaysYear;

  const M6 = stripsCanSpec;
  const N6_raw = H6 / M6;
  const O6_raw = I6 / M6;

  // -------------------------------------------------------------
  // HOJA 1: EU-5600Pro
  // -------------------------------------------------------------
  // EU-50:
  // Botella/mes (E9) = Redondeado al inmediato superior
  const E9 = Math.ceil(N4_raw);
  // Botella/año (F9) = Redondeado al inmediato superior
  const F9 = Math.ceil(O4_raw);
  const G9 = 4.0;

  // Package/year (Envase/año) en la tabla: Math.round (>= 0.5 redondea hacia arriba, < 0.5 hacia abajo)
  const H9 = Math.round((F9 < G9 ? G9 : F9) / 2);

  // URS-Strips(11 items)
  const E10 = Number(N6_raw.toFixed(1));
  const F10 = Number(O6_raw.toFixed(1));
  const H10 = Math.round(F10 / 10);

  // URS-Strips(14 items)
  const E11 = Number(N6_raw.toFixed(1));
  const F11 = Number(O6_raw.toFixed(1));
  const H11 = Math.round(F11 / 10);

  // Cost/test (E3 in Sheet 1) Exact Excel Formula:
  // =SI(C10=0; (H9_raw*C9 + C11*H11_raw)/(D3*(B3+B4+B5)); (H9_raw*C9 + C10*H11_raw)/(D3*(B3+B4+B5)))
  const C9 = priceEu50;
  const C10 = priceStrips11;
  const C11 = priceStrips14;
  const D3 = operatingDaysYear;
  const B3 = dryChemistryDaily;
  const B4 = sedimentDaily;
  const B5 = comboDaily;

  // In Excel, H9_raw = F9/2 and H11_raw = F11/10
  const H9_raw = F9 / 2;
  const H11_raw = F11 / 10;

  let E3_costPerTest = 0;
  const totalDailyTests = B3 + B4 + B5;

  if (D3 > 0 && totalDailyTests > 0) {
    if (C10 === 0) {
      E3_costPerTest = (H9_raw * C9 + C11 * H11_raw) / (D3 * totalDailyTests);
    } else {
      E3_costPerTest = (H9_raw * C9 + C10 * H11_raw) / (D3 * totalDailyTests);
    }
  }

  return {
    dias_operacion_mes: operatingDaysMonth,
    dias_operacion_ano: operatingDaysYear,
    tabla1: {
      dryChemistryDaily,
      sedimentDaily,
      comboDaily,
      operatingDaysMonth,
      operatingDaysYear,
      costo_prueba_fob: E3_costPerTest,
      eu50: {
        precio: priceEu50,
        botella_mes: E9,
        botella_ano: F9,
        botella_caducidad: G9,
        envase_ano: H9
      },
      strips11: {
        precio: priceStrips11,
        botella_mes: E10,
        botella_ano: F10,
        botella_caducidad: "/",
        envase_ano: H10
      },
      strips14: {
        precio: priceStrips14,
        botella_mes: E11,
        botella_ano: F11,
        botella_caducidad: "/",
        envase_ano: H11
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
        dry: { dia: dryChemistryDaily, ml_sample: dryMlPerSample, cons_dia: G3, cons_mes: H3, cons_ano: I3 },
        sed: { dia: sedimentDaily, ml_sample: sedMlPerSample, cons_dia: G4, cons_mes: H4, cons_ano: I4 },
        combo: { dia: comboDaily, ml_sample: comboMlPerSample, cons_dia: G5, cons_mes: H5, cons_ano: I5 },
        volumen_muerto: `${(eu50DeadVolumeRatio * 100).toFixed(1)}%`,
        start_up: eu50StartUp,
        shut_down: eu50ShutDown,
        especificacion_frasco: eu50BottleSpec,
        frasco_mes: N4_raw.toFixed(1),
        frasco_ano: O4_raw.toFixed(1)
      },
      strips: {
        dia: C6,
        ml_sample: stripsMlPerSample,
        cons_dia: G6,
        cons_mes: H6,
        cons_ano: I6,
        volumen_muerto: "0%",
        start_up: 0,
        shut_down: 0,
        especificacion_frasco: stripsCanSpec,
        frasco_mes: N6_raw.toFixed(1),
        frasco_ano: O6_raw.toFixed(1)
      },
      cleanser: {
        shut_down: cleanserShutDown
      }
    }
  };
}
