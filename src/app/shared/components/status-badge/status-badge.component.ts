import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StatusVariant =
  | 'available'
  | 'occupied'
  | 'cleaning'
  | 'reserved'
  | 'maintenance'
  | 'pending'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'critical'
  | 'abnormal'
  | 'normal'
  | 'immediate'
  | 'urgent'
  | 'less-urgent'
  | 'non-urgent'
  | 'deceased';

@Component({
  selector: 'mc-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="mc-status-badge"
      [class]="'mc-status-badge--' + variant()"
      [attr.data-test]="testId()"
      [attr.aria-label]="ariaLabel()"
    >
      @if (showDot()) {
        <span class="mc-status-badge__dot" aria-hidden="true"></span>
      }
      {{ displayLabel() }}
    </span>
  `,
  styles: [
    `
      .mc-status-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.35em;
        padding: 0.2em 0.65em;
        border-radius: var(--mc-radius-full);
        font-size: var(--mc-font-size-xs);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        line-height: 1.4;
        white-space: nowrap;
      }
      .mc-status-badge__dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
        flex-shrink: 0;
      }
      .mc-status-badge--available { background: #e8f5e9; color: var(--mc-status-available); }
      .mc-status-badge--occupied { background: #ffebee; color: var(--mc-status-occupied); }
      .mc-status-badge--cleaning { background: #fff8e1; color: var(--mc-status-cleaning); }
      .mc-status-badge--reserved { background: #e3f2fd; color: var(--mc-status-reserved); }
      .mc-status-badge--maintenance { background: #f5f5f5; color: var(--mc-status-maintenance); }
      .mc-status-badge--pending { background: #fff8e1; color: var(--mc-warning-700); }
      .mc-status-badge--confirmed { background: #e3f2fd; color: var(--mc-primary-800); }
      .mc-status-badge--in-progress { background: #e8eaf6; color: #3949ab; }
      .mc-status-badge--completed { background: #e8f5e9; color: var(--mc-accent-800); }
      .mc-status-badge--cancelled { background: #f5f5f5; color: var(--mc-text-secondary); }
      .mc-status-badge--critical { background: #ffebee; color: var(--mc-alert-800); }
      .mc-status-badge--abnormal { background: #fff3e0; color: #e65100; }
      .mc-status-badge--normal { background: #e8f5e9; color: var(--mc-accent-800); }
      .mc-status-badge--immediate { background: #c62828; color: white; }
      .mc-status-badge--urgent { background: #ef6c00; color: white; }
      .mc-status-badge--less-urgent { background: #f9a825; color: #212121; }
      .mc-status-badge--non-urgent { background: #2e7d32; color: white; }
      .mc-status-badge--deceased { background: #212121; color: white; }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadgeComponent {
  readonly variant = input.required<StatusVariant>();
  readonly label = input<string | null>(null);
  readonly showDot = input(true);
  readonly testId = input('status-badge');

  readonly displayLabel = computed(() => {
    if (this.label()) return this.label()!;
    return this.variant().replace(/-/g, ' ');
  });

  readonly ariaLabel = computed(() => `Status: ${this.displayLabel()}`);
}
