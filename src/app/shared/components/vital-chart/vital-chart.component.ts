import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface VitalPoint {
  timestamp: string | Date;
  value: number;
}

/**
 * Placeholder vital signs chart.
 * Full Chart.js + ng2-charts integration comes with EMR module.
 */
@Component({
  selector: 'mc-vital-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mc-vital-chart" [attr.data-test]="testId()" role="img" [attr.aria-label]="label() + ' chart'">
      <div class="mc-vital-chart__header">
        <span class="mc-vital-chart__label">{{ label() }}</span>
        @if (unit()) {
          <span class="mc-vital-chart__unit">({{ unit() }})</span>
        }
        @if (latest() != null) {
          <span class="mc-vital-chart__latest">{{ latest() }}{{ unit() ? ' ' + unit() : '' }}</span>
        }
      </div>
      <div class="mc-vital-chart__canvas">
        @if (points().length === 0) {
          <p class="mc-vital-chart__empty">No data yet</p>
        } @else {
          <div class="mc-vital-chart__bars" aria-hidden="true">
            @for (p of points(); track $index) {
              <div
                class="mc-vital-chart__bar"
                [style.height.%]="barHeight(p.value)"
                [title]="p.value + (unit() ? ' ' + unit() : '')"
              ></div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .mc-vital-chart {
        background: var(--mc-surface);
        border: 1px solid var(--mc-border);
        border-radius: var(--mc-radius-lg);
        padding: var(--mc-space-4);
      }
      .mc-vital-chart__header {
        display: flex;
        align-items: baseline;
        gap: var(--mc-space-2);
        margin-bottom: var(--mc-space-3);
        flex-wrap: wrap;
      }
      .mc-vital-chart__label {
        font-weight: 600;
        font-size: var(--mc-font-size-sm);
      }
      .mc-vital-chart__unit {
        font-size: var(--mc-font-size-xs);
        color: var(--mc-text-secondary);
      }
      .mc-vital-chart__latest {
        margin-left: auto;
        font-weight: 700;
        font-size: var(--mc-font-size-lg);
        color: var(--mc-primary-800);
      }
      .mc-vital-chart__canvas {
        height: 120px;
        display: flex;
        align-items: flex-end;
      }
      .mc-vital-chart__bars {
        display: flex;
        align-items: flex-end;
        gap: 4px;
        width: 100%;
        height: 100%;
      }
      .mc-vital-chart__bar {
        flex: 1;
        min-width: 4px;
        background: var(--mc-primary-400);
        border-radius: 2px 2px 0 0;
        transition: height var(--mc-transition-fast);
        min-height: 2px;
      }
      .mc-vital-chart__empty {
        color: var(--mc-text-disabled);
        font-size: var(--mc-font-size-sm);
        margin: 0;
        width: 100%;
        text-align: center;
        align-self: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VitalChartComponent {
  readonly label = input.required<string>();
  readonly unit = input<string | null>(null);
  readonly points = input<VitalPoint[]>([]);
  readonly min = input(0);
  readonly max = input(200);
  readonly testId = input('vital-chart');

  latest(): number | null {
    const pts = this.points();
    if (!pts.length) return null;
    return pts[pts.length - 1].value;
  }

  barHeight(value: number): number {
    const range = this.max() - this.min();
    if (range <= 0) return 0;
    return Math.max(2, Math.min(100, ((value - this.min()) / range) * 100));
  }
}
