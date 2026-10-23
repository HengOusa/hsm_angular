import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats medical codes (ICD-10, CPT, etc.) for display.
 * Usage: {{ 'j06.9' | mcMedicalCode }} → "J06.9"
 */
@Pipe({ name: 'mcMedicalCode', standalone: true, pure: true })
export class MedicalCodePipe implements PipeTransform {
  transform(code: string | null | undefined, system?: string): string {
    if (!code) return '—';
    const formatted = code.trim().toUpperCase();
    return system ? `${system}: ${formatted}` : formatted;
  }
}
