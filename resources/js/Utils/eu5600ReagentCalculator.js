/**
 * EU-5600 Pro Reagent Consumption & HUC Cost Engine
 * Uses the exact Excel formulas provided by the user for Sheets "EU-5600Pro" & "consumo de reactivos".
 */

export function calculateEU5600ReagentConsumption(params = {}) {
  // Input parameters (Sheet 1 & Sheet 2)
  const dryChemistryDaily = Number(params.dryChemistryDaily !== undefined ? params.dryChemistryDaily : 100);
  const sedimentDaily = Number(params.sedimentDaily !== undefined ? params.sedimentDaily : 100);
  const comboDaily = Number(params.comboDaily !== undefined ? params.comboDaily : 100);

  const dryMlPerSample = Number(params.dryMlPerSample !== undefined ? params.dryMlPerSample : 4);
  const sedMlPerSample = Number(params.sedMlPerSample !== undefined ? params.sedMlPerSample : 16);
  const comboMlPerSample = Number(params.comboMlPerSample !== undefined ? params.comboMlPerSample : 16);

  const operatingDaysMonth = Number(params.operatingDaysMonth !== undefined ? params.operatingDaysMonth : 24);
  const operatingDaysYear = operatingDaysMonth * 12;

  // Technical Specs for EU-50 (Row 3 in Sheet 2)
  const eu50DeadVolumeRatio = Number(params.eu50DeadVolumeRatio !== undefined ? params.eu50DeadVolumeRatio : 0.05); // J3 = 5%
  const eu50StartUp = Number(params.eu50StartUp !== undefined ? params.eu50StartUp : 54); // K3 = 54ml
  const eu50ShutDown = Number(params.eu50ShutDown !== undefined ? params.eu50ShutDown : 70); // L3 = 70ml
  const eu50BottleSpec = Number(params.eu50BottleSpec !== undefined ? params.eu50BottleSpec : 5000); // M3 = 5000ml

  // Technical Specs for Strips (Row 6 in Sheet 2)
  const stripsMlPerSample = Number(params.stripsMlPerSample !== undefined ? params.stripsMlPerSample : 1);
  const stripsCanSpec = Number(params.stripsCanSpec !== undefined ? params.stripsCanSpec : 100); // M6 = 100 tiras/lata

  // Technical Specs for Cleanser (Row 7 in Sheet 2)
  const cleanserShutDown = Number(params.cleanserShutDown !== undefined ? params.cleanserShutDown : 6);

  // Prices (Sheet 1)
  const priceEu50 = Number(params.priceEu50 !== undefined ? params.priceEu50 : 105);
  const priceStrips11 = Number(params.priceStrips11 !== undefined ? params.priceStrips11 : 90);
  const priceStrips14 = Number(params.priceStrips14 !== undefined ? params.priceStrips14 : 108);
  const priceCleanser = Number(params.priceCleanser !== undefined ? params.priceCleanser : 0);

  // -------------------------------------------------------------
  // HOJA 2: CONSUMO DE REACTIVOS (Formulas exactas de Excel)
  // -------------------------------------------------------------
  // EU-50 Daily, Monthly, Annual consumption
  const G3 = dryChemistryDaily * dryMlPerSample; // Consumo/dia Química seca
  const H3 = G3 * operatingDaysMonth; // Consumo/mes
  const I3 = G3 * operatingDaysYear; // Consumo/año

  const G4 = sedimentDaily * sedMlPerSample; // Consumo/dia Sedimento
  const H4 = G4 * operatingDaysMonth; // Consumo/mes
  const I4 = G4 * operatingDaysYear; // Consumo/año

  const G5 = comboDaily * comboMlPerSample; // Consumo/dia Combo
  const H5 = G5 * operatingDaysMonth; // Consumo/mes
  const I5 = G5 * operatingDaysYear; // Consumo/año

  // EU-50 Frasco/mes (N4) Formula provided:
  // =(H3+H4+H5+K3*E3+L3*E3)/(M3*(1-J3))
  const E3 = operatingDaysMonth;
  const F3 = operatingDaysYear;
  const K3 = eu50StartUp;
  const L3 = eu50ShutDown;
  const M3 = eu50BottleSpec;
  const J3 = eu50DeadVolumeRatio;

  const N4_raw = (H3 + H4 + H5 + K3 * E3 + L3 * E3) / (M3 * (1 - J3));
  const O4_raw = (I3 + I4 + I5 + K3 * F3 + L3 * F3) / (M3 * (1 - J3));

  // Strips Row 6 (Excel Formula: C6 = C3 + C5)
  const C6 = dryChemistryDaily + comboDaily; // Pruebas/dia para tiras
  const G6 = C6 * stripsMlPerSample; // Consumo/dia
  const H6 = G6 * operatingDaysMonth; // Consumo/mes
  const I6 = G6 * operatingDaysYear; // Consumo/año

  const M6 = stripsCanSpec;
  const N6_raw = H6 / M6; // Frasco/mes = H6/M6
  const O6_raw = I6 / M6; // Frasco/año = I6/M6

  // -------------------------------------------------------------
  // HOJA 1: EU-5600Pro (Formulas exactas de Excel)
  // -------------------------------------------------------------
  // EU-50 (Row 9 in Sheet 1)
  const E9 = Math.round(N4_raw * 10) / 10; // Bottle/month
  const F9 = Math.round(O4_raw * 10) / 10; // Bottle/year (solo cálculo)
  const G9 = 4.0; // Bottle/year (Including Expiration)

  // Package/year (H9) Formula provided: =SI(F9<G9; G9; F9)/2
  const H9 = Math.round((F9 < G9 ? G9 : F9) / 2);

  // URS-Strips(11 items) (Row 10 in Sheet 1)
  const E10 = Math.round(N6_raw * 10) / 10; // Bottle/month
  const F10 = Math.round(O6_raw * 10) / 10; // Bottle/year (solo cálculo)
  // Package/year (H10) Formula provided: =F10/10
  const H10 = Math.round(F10 / 10);

  // URS-Strips(14 items) (Row 11 in Sheet 1)
  const E11 = Math.round(N6_raw * 10) / 10; // Bottle/month
  const F11 = Math.round(O6_raw * 10) / 10; // Bottle/year (solo cálculo)
  // Package/year (H11) Formula provided: =F11/10
  const H11 = Math.round(F11 / 10);

  // Cost/test (E3 in Sheet 1) Formula provided:
  // =SI(C10=0; (H9*C9+C11*H11)/(D3*(B3+B4+B5)); (H9*C9+C10*H10)/(D3*(B3+B4+B5)))
  const C9 = priceEu50;
  const C10 = priceStrips11;
  const C11 = priceStrips14;
  const D3 = operatingDaysYear;
  const B3 = dryChemistryDaily;
  const B4 = sedimentDaily;
  const B5 = comboDaily;

  let E3_costPerTest = 0;
  const totalDailyTests = B3 + B4 + B5;

  if (D3 > 0 && totalDailyTests > 0) {
    if (C10 === 0) {
      E3_costPerTest = (H9 * C9 + C11 * H11) / (D3 * totalDailyTests);
    } else {
      E3_costPerTest = (H9 * C9 + C10 * H10) / (D3 * totalDailyTests);
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
        volumen_muerto: `${(eu50DeadVolumeRatio * 100).toFixed(0)}%`,
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
