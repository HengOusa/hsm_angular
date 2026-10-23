import { Pipe, PipeTransform } from '@angular/core';

const VALID = new Set(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);

/**
 * Formats / validates blood group display.
 * Usage: {{ patient.bloodGroup | mcBloodGroup }}
 */
@Pipe({ name: 'mcBloodGroup', standalone: true, pure: true })
export class BloodGroupPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return 'Unknown';
    const normalized = value.trim().toUpperCase().replace(/\s/g, '');
    return VALID.has(normalized) ? normalized : value;
  }
}
