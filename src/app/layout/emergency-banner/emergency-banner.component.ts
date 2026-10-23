import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'mc-emergency-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="mc-emergency" role="alert" aria-live="assertive" data-test="emergency-banner">
      <mat-icon class="mc-emergency__icon mc-pulse">emergency</mat-icon>
      <span class="mc-emergency__text">
        <strong>CODE BLUE</strong> — Active emergency. Team activation required.
      </span>
      <button mat-stroked-button color="warn" type="button" class="mc-emergency__action" data-test="emergency-view-btn">
        View Board
      </button>
      <button mat-icon-button type="button" aria-label="Dismiss" (click)="dismiss.emit()" data-test="emergency-dismiss-btn">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [
    `
      .mc-emergency {
        display: flex;
        align-items: center;
        gap: var(--mc-space-3);
        height: 100%;
        padding: 0 var(--mc-space-4);
        background: var(--mc-alert-800);
        color: white;
      }
      .mc-emergency__icon {
        flex-shrink: 0;
      }
      .mc-emergency__text {
        flex: 1;
        font-size: var(--mc-font-size-sm);
      }
      .mc-emergency__action {
        border-color: white !important;
        color: white !important;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmergencyBannerComponent {
  readonly dismiss = output<void>();
}
