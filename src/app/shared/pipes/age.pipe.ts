import { Pipe, PipeTransform } from '@angular/core';

/**
 * Computes age in years from a date of birth.
 * Usage: {{ patient.dateOfBirth | mcAge }} → "42"
 *        {{ patient.dateOfBirth | mcAge:'full' }} → "42 years"
 */
@Pipe({ name: 'mcAge', standalone: true, pure: true })
export class AgePipe implements PipeTransform {
  transform(dob: string | Date | null | undefined, format: 'number' | 'full' = 'number'): string {
    if (!dob) return '—';
    const birth = typeof dob === 'string' ? new Date(dob) : dob;
    if (isNaN(birth.getTime())) return '—';

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age < 0) return '—';
    return format === 'full' ? `${age} year${age === 1 ? '' : 's'}` : String(age);
  }
}
