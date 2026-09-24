/**
 * Clinical Vitals Helpers and Validation Utilities
 * Rithanya Hospital Platform
 */

export const CLINICAL_RANGES = {
  haemoglobin: { min: 1.0, max: 25.0, normalMin: 11.5, normalMax: 17.5, unit: 'g/dL', label: 'Haemoglobin' },
  spo2: { min: 40, max: 100, normalMin: 95, normalMax: 100, unit: '%', label: 'SpO2' },
  pulse: { min: 20, max: 300, normalMin: 60, normalMax: 100, unit: 'bpm', label: 'Pulse Rate' },
  bloodSugarFasting: { min: 20, max: 1000, normalMin: 70, normalMax: 100, unit: 'mg/dL', label: 'Fasting Blood Sugar' },
  bloodSugarPP: { min: 20, max: 1000, normalMin: 90, normalMax: 140, unit: 'mg/dL', label: 'Postprandial Blood Sugar' },
  hba1c: { min: 2.0, max: 25.0, normalMin: 4.0, normalMax: 5.6, unit: '%', label: 'HbA1c' },
  bpSystolic: { min: 40, max: 350, normalMin: 90, normalMax: 120, unit: 'mmHg', label: 'Systolic Blood Pressure' },
  bpDiastolic: { min: 20, max: 250, normalMin: 60, normalMax: 80, unit: 'mmHg', label: 'Diastolic Blood Pressure' },
  ferritin: { min: 0, max: 50000, normalMin: 20, normalMax: 300, unit: 'ng/mL', label: 'Serum Ferritin' },
  temperature: { min: 90.0, max: 110.0, normalMin: 97.0, normalMax: 99.5, unit: '°F', label: 'Body Temperature' }
};

/**
 * Validates clinical vitals form data and returns errors and clinical warning flags
 * @param {Object} data 
 * @returns {{ isValid: boolean, errors: Object, warnings: Object }}
 */
export function validateClinicalVitals(data) {
  const errors = {};
  const warnings = {};

  if (!data.date) {
    errors.date = 'Record date is required';
  }

  // Validate numeric fields against plausible physical boundaries
  Object.keys(CLINICAL_RANGES).forEach((field) => {
    const rawVal = data[field];
    if (rawVal !== undefined && rawVal !== null && rawVal !== '') {
      const num = Number(rawVal);
      if (isNaN(num)) {
        errors[field] = `${CLINICAL_RANGES[field].label} must be a valid number`;
        return;
      }

      const range = CLINICAL_RANGES[field];
      if (num < range.min || num > range.max) {
        errors[field] = `${range.label} must be between ${range.min} and ${range.max} ${range.unit}`;
      } else if (num < range.normalMin || num > range.normalMax) {
        // Out of typical normal reference range (clinical alert warning)
        if (num < range.normalMin) {
          warnings[field] = `Low (${num} ${range.unit} < ref ${range.normalMin})`;
        } else {
          warnings[field] = `High (${num} ${range.unit} > ref ${range.normalMax})`;
        }
      }
    }
  });

  // Check Blood Pressure consistency if both entered
  if (data.bpSystolic && data.bpDiastolic) {
    const sys = Number(data.bpSystolic);
    const dia = Number(data.bpDiastolic);
    if (!isNaN(sys) && !isNaN(dia) && dia >= sys) {
      errors.bpDiastolic = 'Diastolic BP must be lower than Systolic BP';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings
  };
}

/**
 * Calculates adaptive min/max bounds for ChartJS scales so curves are neither
 * squashed flat near zero nor clipped at the viewport edges.
 * 
 * @param {Array<Array<number|null>>} datasetValues Array of value arrays
 * @param {Object} options Configuration options
 * @returns {Object} Chart.js scale configuration options
 */
export function calculateAdaptiveScale(datasetValues, options = {}) {
  const {
    bufferRatio = 0.15,
    minRangeSpread = 4,
    defaultMin = 0,
    defaultMax = 100,
    allowZeroFloor = false
  } = options;

  const validNumbers = datasetValues
    .flat()
    .filter((v) => v !== null && v !== undefined && !isNaN(Number(v)))
    .map((v) => Number(v));

  if (validNumbers.length === 0) {
    return {
      suggestedMin: defaultMin,
      suggestedMax: defaultMax,
      beginAtZero: allowZeroFloor
    };
  }

  const rawMin = Math.min(...validNumbers);
  const rawMax = Math.max(...validNumbers);
  const range = rawMax - rawMin;

  const effectiveRange = Math.max(range, minRangeSpread);
  const padding = effectiveRange * bufferRatio;

  let suggestedMin = Math.floor(rawMin - padding);
  let suggestedMax = Math.ceil(rawMax + padding);

  if (allowZeroFloor && rawMin >= 0) {
    suggestedMin = Math.max(0, suggestedMin);
  }

  if (suggestedMax <= suggestedMin) {
    suggestedMax = suggestedMin + minRangeSpread;
  }

  return {
    suggestedMin,
    suggestedMax,
    beginAtZero: false
  };
}
