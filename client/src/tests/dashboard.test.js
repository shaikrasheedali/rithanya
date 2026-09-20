import { describe, it, expect, beforeEach, vi } from 'vitest';
import { hasPermission, isSuperAdmin, isAuthenticated, setSession, clearSession, getStoredUser, getStoredToken } from '../utils/auth';
import { formatCurrency, formatINR, formatDate, getBloodGroupBadgeClass } from '../utils/formatters';

// Helper function mirroring the exact dashboard treatment form sanitization
function sanitizeTreatmentPayload(formData) {
  const procedures = formData.proceduresText
    ? formData.proceduresText.split('\n').map((s) => s.trim()).filter(Boolean)
    : [];

  const { proceduresText: _omitted, ...cleanFormData } = formData;
  return {
    ...cleanFormData,
    procedures
  };
}

// Helper function calculating live unreserved blood units matching the 4x2 grid cards
function computeLiveBloodStock(stock) {
  const liveCount = stock.availableUnits !== undefined
    ? stock.availableUnits
    : (stock.unreservedUnits !== undefined
      ? stock.unreservedUnits
      : Math.max(0, (stock.units || 0) - (stock.reservedUnits || 0)));
  const thresholdVal = stock.threshold || 5;
  const isLow = stock.isLow !== undefined ? stock.isLow : (liveCount <= thresholdVal);
  return { liveCount, thresholdVal, isLow };
}

describe('Admin Dashboard: Treatment Payload Sanitization', () => {
  it('correctly excludes proceduresText from the payload and parses procedures array', () => {
    const rawForm = {
      title: 'Thalassemia Daycare Transfusion',
      slug: 'thalassemia-daycare-transfusion',
      category: 'Daycare Hematology',
      department: 'Hematology & Transfusion Centre',
      doctorName: 'Dr. Narayana Murthy, MD',
      duration: '3 - 4 Hours',
      proceduresText: 'Pre-transfusion compatibility crossmatching\nLeukodepletion micro-aggregate filtration\nContinuous bedside vitals monitoring',
      status: 'published'
    };

    const payload = sanitizeTreatmentPayload(rawForm);

    expect(payload.proceduresText).toBeUndefined();
    expect(payload.title).toBe('Thalassemia Daycare Transfusion');
    expect(payload.procedures).toEqual([
      'Pre-transfusion compatibility crossmatching',
      'Leukodepletion micro-aggregate filtration',
      'Continuous bedside vitals monitoring'
    ]);
  });

  it('handles empty or whitespace-only proceduresText gracefully', () => {
    const rawForm = {
      title: 'Iron Chelation Consultation',
      proceduresText: '   \n\n   \n'
    };

    const payload = sanitizeTreatmentPayload(rawForm);
    expect(payload.proceduresText).toBeUndefined();
    expect(payload.procedures).toEqual([]);
  });

  it('trims whitespace and ignores blank lines between procedures', () => {
    const rawForm = {
      title: 'Glycemic Evaluation',
      proceduresText: '  Continuous Glucose Monitoring  \n\n   Microalbuminuria Screening   '
    };

    const payload = sanitizeTreatmentPayload(rawForm);
    expect(payload.procedures).toEqual([
      'Continuous Glucose Monitoring',
      'Microalbuminuria Screening'
    ]);
  });
});

describe('RBAC: Module Permissions and Access Control', () => {
  it('grants full access to SUPERADMIN and ADMIN regardless of specific module', () => {
    const superadmin = { role: 'SUPERADMIN', email: 'mgrhameed@gmail.com' };
    const admin = { role: 'ADMIN', email: 'admin@rithanyahospital.com' };

    expect(hasPermission(superadmin, 'dashboard')).toBe(true);
    expect(hasPermission(superadmin, 'treatments')).toBe(true);
    expect(hasPermission(superadmin, 'finance')).toBe(true);
    expect(hasPermission(superadmin, 'settings')).toBe(true);

    expect(hasPermission(admin, 'treatments')).toBe(true);
    expect(hasPermission(admin, 'inventory')).toBe(true);
  });

  it('restricts STAFF to only their allowedModules', () => {
    const staffUser = {
      role: 'STAFF',
      email: 'nurse@rithanyahospital.com',
      allowedModules: ['dashboard', 'treatments', 'inventory', 'admissions']
    };

    expect(hasPermission(staffUser, 'treatments')).toBe(true);
    expect(hasPermission(staffUser, 'inventory')).toBe(true);
    expect(hasPermission(staffUser, 'dashboard')).toBe(true);

    // Should deny access to disallowed modules
    expect(hasPermission(staffUser, 'finance')).toBe(false);
    expect(hasPermission(staffUser, 'settings')).toBe(false);
    expect(hasPermission(staffUser, 'credentials')).toBe(false);
  });

  it('returns false for null or undefined user', () => {
    expect(hasPermission(null, 'treatments')).toBe(false);
    expect(hasPermission(undefined, 'treatments')).toBe(false);
  });

  it('identifies superadmin role accurately', () => {
    expect(isSuperAdmin({ role: 'SUPERADMIN' })).toBe(true);
    expect(isSuperAdmin({ role: 'ADMIN' })).toBe(false);
    expect(isSuperAdmin({ role: 'STAFF' })).toBe(false);
    expect(isSuperAdmin(null)).toBeFalsy();
  });
});

describe('Auth & Session Management', () => {
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => { store[key] = value.toString(); },
      removeItem: (key) => { delete store[key]; },
      clear: () => { store = {}; }
    };
  })();

  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock);
    localStorage.clear();
  });

  it('stores and retrieves session data correctly', () => {
    const user = { id: 'u1', name: 'Dr. Narayana Murthy', role: 'ADMIN', email: 'admin@rithanyahospital.com' };
    const token = 'sample-jwt-token-123';

    setSession(token, user);
    expect(getStoredToken()).toBe(token);
    expect(getStoredUser()).toEqual(user);
    expect(isAuthenticated()).toBe(true);

    clearSession();
    expect(getStoredToken()).toBeNull();
    expect(getStoredUser()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });
});

describe('Blood Bank 4x2 Grid Calculation and Badge Styling', () => {
  it('correctly calculates live unreserved stock units', () => {
    const stock1 = { group: 'O+', units: 20, reservedUnits: 4, threshold: 5 };
    const res1 = computeLiveBloodStock(stock1);
    expect(res1.liveCount).toBe(16);
    expect(res1.isLow).toBe(false);

    const stock2 = { group: 'AB-', units: 4, reservedUnits: 1, threshold: 5 };
    const res2 = computeLiveBloodStock(stock2);
    expect(res2.liveCount).toBe(3);
    expect(res2.isLow).toBe(true); // 3 <= threshold(5)
  });

  it('assigns proper badge color classes for blood groups', () => {
    expect(getBloodGroupBadgeClass('O+')).toBe('badge-red');
    expect(getBloodGroupBadgeClass('O-')).toBe('badge-red');
    expect(getBloodGroupBadgeClass('A+')).toBe('badge-blue');
    expect(getBloodGroupBadgeClass('A-')).toBe('badge-blue');
    expect(getBloodGroupBadgeClass('B+')).toBe('badge-amber');
    expect(getBloodGroupBadgeClass('B-')).toBe('badge-amber');
    expect(getBloodGroupBadgeClass('AB+')).toBe('badge-green');
    expect(getBloodGroupBadgeClass('AB-')).toBe('badge-green');
  });
});

describe('Formatters and Currency', () => {
  it('formats INR currency correctly', () => {
    expect(formatCurrency(0)).toMatch(/₹\s?0/);
    expect(formatINR(1500)).toMatch(/₹\s?1,500/);
    expect(formatCurrency(null)).toBe('₹0');
  });

  it('formats dates consistently', () => {
    const formatted = formatDate('2026-09-21T00:00:00Z');
    expect(formatted).toMatch(/2026/);
    expect(formatDate(null)).toBe('N/A');
  });
});
