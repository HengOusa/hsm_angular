import { Pipe, PipeTransform } from '@angular/core';

/**
 * Relative time display for medical timelines.
 * Usage: {{ vitals.recordedAt | mcTimeAgo }} → "5 min ago"
 */
@Pipe({ name: 'mcTimeAgo', standalone: true, pure: true })
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '—';
    const date = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(date.getTime())) return '—';

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 0) return 'just now';
    if (seconds < 60) return 'just now';
    if (seconds < 3600) {
      const m = Math.floor(seconds / 60);
      return `${m} min ago`;
    }
    if (seconds < 86400) {
      const h = Math.floor(seconds / 3600);
      return `${h} hour${h === 1 ? '' : 's'} ago`;
    }
    if (seconds < 604800) {
      const d = Math.floor(seconds / 86400);
      return `${d} day${d === 1 ? '' : 's'} ago`;
    }
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  }
}
