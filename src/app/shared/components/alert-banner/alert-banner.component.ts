import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'critical';

@Component({
  selector: 'mc-alert-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div
      class="mc-alert"
      [class]="'mc-alert--' + variant()"
      role="alert"
      [attr.aria-live]="variant() === 'critical' ? 'assertive' : 'polite'"
      [attr.data-test]="testId()"
    >
      <mat-icon class="mc-alert__icon" aria-hidden="true">{{ iconName() }}</mat-icon>
      <div class="mc-alert__content">
        @if (title()) {
          <strong class="mc-alert__title">{{ title() }}</strong>
        }
        <span class="mc-alert__message">{{ message() }}</span>
      </div>
      <div class="mc-alert__actions">
        <ng-content select="[actions]"></ng-content>
        @if (dismissible()) {
          <button
            mat-icon-button
            type="button"
            (click)="dismissed.emit()"
            aria-label="Dismiss alert"
            data-test="alert-dismiss"
          >
            <mat-icon>close</mat-icon>
          </button>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .mc-alert {
        display: flex;
        align-items: flex-start;
        gap: var(--mc-space-3);
        padding: var(--mc-space-3) var(--mc-space-4);
        border-radius: var(--mc-radius-md);
        border: 1px solid transparent;
        font-size: var(--mc-font-size-sm);
      }
      .mc-alert__icon {
        flex-shrink: 0;
        margin-top: 1px;
      }
      .mc-alert__content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      .mc-alert__title {
        font-weight: 600;
      }
      .mc-alert__actions {
        display: flex;
        align-items: center;
        gap: var(--mc-space-1);
        flex-shrink: 0;
      }
      .mc-alert--info {
        background: #e3f2fd;
        border-color: #90caf9;
        color: #0d47a1;
      }
      .mc-alert--success {
        background: #e8f5e9;
        border-color: #a5d6a7;
        color: #1b5e20;
      }
      .mc-alert--warning {
        background: #fff8e1;
        border-color: #ffe082;
        color: #e65100;
      }
      .mc-alert--error {
        background: #ffebee;
        border-color: #ef9a9a;
        color: #b71c1c;
      }
      .mc-alert--critical {
        background: var(--mc-alert-800);
        border-color: var(--mc-alert-800);
        color: white;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertBannerComponent {
  readonly variant = input<AlertVariant>('info');
  readonly title = input<string | null>(null);
  readonly message = input.required<string>();
  readonly dismissible = input(true);
  readonly testId = input('alert-banner');

  readonly dismissed = output<void>();

  iconName(): string {
    const map: Record<AlertVariant, string> = {
      info: 'info',
      success: 'check_circle',
      warning: 'warning',
      error: 'error',
      critical: 'emergency',
    };
    return map[this.variant()];
  }
}
