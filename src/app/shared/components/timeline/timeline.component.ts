import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface TimelineItem {
  id: string;
  title: string;
  subtitle?: string;
  timestamp: string | Date;
  icon?: string;
  color?: 'primary' | 'accent' | 'alert' | 'warning' | 'neutral';
  meta?: string;
}

@Component({
  selector: 'mc-timeline',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
  readonly items = input.required<TimelineItem[]>();
  readonly testId = input('timeline');

  formatTime(ts: string | Date): string {
    const d = typeof ts === 'string' ? new Date(ts) : ts;
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
