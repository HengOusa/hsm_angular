import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Medical-context validators with clear error messages for clinical staff.
 */

/** Blood group: A+, A-, B+, B-, AB+, AB-, O+, O- */
export function bloodGroupValidator(): ValidatorFn {
  const valid = /^(A|B|AB|O)[+-]$/i;
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return valid.test(String(control.value).trim())
      ? null
      : { bloodGroup: { message: 'Enter a valid blood group (e.g. A+, O-)' } };
  };
}

/** MRN / medical record number – alphanumeric, 6–20 chars */
export function mrnValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const v = String(control.value).trim();
    if (!/^[A-Za-z0-9-]{6,20}$/.test(v)) {
      return { mrn: { message: 'MRN must be 6–20 alphanumeric characters' } };
    }
    return null;
  };
}

/** Phone – basic international-friendly */
export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const digits = String(control.value).replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      return { phone: { message: 'Enter a valid phone number (10–15 digits)' } };
    }
    return null;
  };
}

/** Vital: systolic BP 60–250 */
export function systolicBpValidator(): ValidatorFn {
  return rangeValidator(60, 250, 'Systolic BP must be between 60 and 250 mmHg');
}

/** Vital: diastolic BP 30–150 */
export function diastolicBpValidator(): ValidatorFn {
  return rangeValidator(30, 150, 'Diastolic BP must be between 30 and 150 mmHg');
}

/** Heart rate 20–250 */
export function heartRateValidator(): ValidatorFn {
  return rangeValidator(20, 250, 'Heart rate must be between 20 and 250 bpm');
}

/** Temperature °C 30–45 */
export function temperatureValidator(): ValidatorFn {
  return rangeValidator(30, 45, 'Temperature must be between 30°C and 45°C');
}

/** SpO2 50–100 */
export function spo2Validator(): ValidatorFn {
  return rangeValidator(50, 100, 'SpO₂ must be between 50% and 100%');
}

/** Pain scale 0–10 */
export function painScaleValidator(): ValidatorFn {
  return rangeValidator(0, 10, 'Pain scale must be 0–10');
}

/** ICD-10 style code (simplified) */
export function icd10Validator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const v = String(control.value).trim().toUpperCase();
    // Letter + 2 digits + optional . + up to 4 more
    if (!/^[A-Z]\d{2}(\.\d{1,4})?$/.test(v)) {
      return { icd10: { message: 'Enter a valid ICD-10 code (e.g. J06.9)' } };
    }
    return null;
  };
}

function rangeValidator(min: number, max: number, message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }
    const n = Number(control.value);
    if (isNaN(n) || n < min || n > max) {
      return { range: { min, max, message } };
    }
    return null;
  };
}
