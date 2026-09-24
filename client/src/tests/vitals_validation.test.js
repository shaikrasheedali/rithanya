import { describe, it, expect } from 'vitest';
import { validateClinicalVitals, calculateAdaptiveScale, CLINICAL_RANGES } from '../utils/vitalsHelper';

describe('Clinical Vitals Input Validation', () => {
  it('passes on valid standard vitals data', () => {
    const validData = {
      date: '2026-09-24',
      haemoglobin: '13.5',
      spo2: '98',
      pulse: '72',
      bloodSugarFasting: '92',
      bloodSugarPP: '135',
      hba1c: '5.4',
      bpSystolic: '120',
      bpDiastolic: '80',
      ferritin: '150'
    };

    const result = validateClinicalVitals(validData);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it('fails when date is missing', () => {
    const noDate = { haemoglobin: '12.0' };
    const result = validateClinicalVitals(noDate);
    expect(result.isValid).toBe(false);
    expect(result.errors.date).toBeDefined();
  });

  it('rejects physiologically impossible Haemoglobin values', () => {
    const lowHb = { date: '2026-09-24', haemoglobin: '0.2' };
    const highHb = { date: '2026-09-24', haemoglobin: '35.0' };

    expect(validateClinicalVitals(lowHb).isValid).toBe(false);
    expect(validateClinicalVitals(highHb).isValid).toBe(false);
  });

  it('rejects SpO2 greater than 100% or below 40%', () => {
    const over100 = { date: '2026-09-24', spo2: '110' };
    const under40 = { date: '2026-09-24', spo2: '30' };

    expect(validateClinicalVitals(over100).isValid).toBe(false);
    expect(validateClinicalVitals(under40).isValid).toBe(false);
  });

  it('rejects Blood Pressure where Diastolic >= Systolic', () => {
    const invertedBP = {
      date: '2026-09-24',
      bpSystolic: '110',
      bpDiastolic: '120'
    };

    const equalBP = {
      date: '2026-09-24',
      bpSystolic: '90',
      bpDiastolic: '90'
    };

    expect(validateClinicalVitals(invertedBP).isValid).toBe(false);
    expect(validateClinicalVitals(equalBP).isValid).toBe(false);
    expect(validateClinicalVitals(invertedBP).errors.bpDiastolic).toContain('lower than Systolic');
  });

  it('generates clinical warnings for out-of-normal reference readings without blocking save', () => {
    const lowHbThalassemia = {
      date: '2026-09-24',
      haemoglobin: '7.8', // valid number, but below normal reference (11.5)
      spo2: '97'
    };

    const result = validateClinicalVitals(lowHbThalassemia);
    expect(result.isValid).toBe(true);
    expect(result.warnings.haemoglobin).toBeDefined();
    expect(result.warnings.haemoglobin).toContain('Low');
  });
});

describe('Dynamic Adaptive Chart Scaling', () => {
  it('returns default bounds for empty or non-numeric dataset', () => {
    const scale = calculateAdaptiveScale([], { defaultMin: 50, defaultMax: 150 });
    expect(scale.suggestedMin).toBe(50);
    expect(scale.suggestedMax).toBe(150);
  });

  it('prevents line squashing for tight ranges by enforcing minRangeSpread', () => {
    // Patient with almost constant Hb values (e.g., 9.1 and 9.3)
    const tightHb = [[9.1, 9.2, 9.3, 9.2]];
    const scale = calculateAdaptiveScale(tightHb, {
      bufferRatio: 0.15,
      minRangeSpread: 2.0
    });

    // The scale spread must be at least minRangeSpread (2.0) rather than (0.2)
    const spread = scale.suggestedMax - scale.suggestedMin;
    expect(spread).toBeGreaterThanOrEqual(2);
    // Upper bound must be strictly greater than lower bound
    expect(scale.suggestedMax).toBeGreaterThan(scale.suggestedMin);
  });

  it('applies proportional padding buffer so edge values are not clipped', () => {
    const glucoseValues = [[90, 110, 150, 220]];
    const scale = calculateAdaptiveScale(glucoseValues, {
      bufferRatio: 0.15,
      minRangeSpread: 20
    });

    // Min value is 90, so suggestedMin should be padded below 90
    expect(scale.suggestedMin).toBeLessThan(90);
    // Max value is 220, so suggestedMax should be padded above 220
    expect(scale.suggestedMax).toBeGreaterThan(220);
  });
});
