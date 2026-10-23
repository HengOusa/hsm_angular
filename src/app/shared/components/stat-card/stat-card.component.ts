import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export type StatCardColor = 'primary' | 'accent' | 'alert' | 'warning' | 'neutral';

@Component({
  selector: 'mc-stat-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  /** Card title / label */
  readonly label = input.required<string>();
  /** Main value displayed */
  readonly value = input.required<string | number>();
  /** Material icon name */
  readonly icon = input<string>('analytics');
  /** Color variant */
  readonly color = input<StatCardColor>('primary');
  /** Optional trend text e.g. "+12%" */
  readonly trend = input<string | null>(null);
  /** Optional subtitle / helper text */
  readonly subtitle = input<string | null>(null);
  /** data-test attribute base */
  readonly testId = input<string>('stat-card');
}
