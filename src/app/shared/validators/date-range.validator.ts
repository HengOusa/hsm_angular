import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Group validator: end date must be on or after start date.
 * Apply on FormGroup that has `startKey` and `endKey` controls.
 *
 * @example
 * this.fb.group({
 *   startDate: [null],
 *   endDate: [null],
 * }, { validators: dateRangeValidator('startDate', 'endDate') });
 */
export function dateRangeValidator(
  startKey: string,
  endKey: string,
  message = 'End date must be on or after start date'
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get(startKey)?.value;
    const end = group.get(endKey)?.value;
    if (!start || !end) return null;

    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;

    if (e < s) {
      return { dateRange: { message } };
    }
    return null;
  };
}

/**
 * Single control: date must not be in the future (e.g. DOB, sample collected).
 */
export function notFutureDateValidator(message = 'Date cannot be in the future'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const d = new Date(control.value);
    if (isNaN(d.getTime())) return null;
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (d > today) {
      return { futureDate: { message } };
    }
    return null;
  };
}

/**
 * Single control: date must be in the past (strict).
 */
export function pastDateValidator(message = 'Date must be in the past'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const d = new Date(control.value);
    if (isNaN(d.getTime())) return null;
    if (d >= new Date()) {
      return { pastDate: { message } };
    }
    return null;
  };
}
