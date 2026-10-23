import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthFacade } from '../../../store/auth/auth.facade';
import { SessionTimeoutService } from '../../../core/services/session-timeout.service';

@Component({
  selector: 'mc-session-timeout',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    @if (facade.showSessionWarning()) {
      <div class="mc-session-overlay" role="alertdialog" aria-modal="true" aria-labelledby="session-title" data-test="session-timeout">
        <div class="mc-session-dialog">
          <div class="mc-session-dialog__icon" aria-hidden="true">
            <mat-icon>timer</mat-icon>
          </div>
          <h2 id="session-title" class="mc-h3">Session expiring</h2>
          <p class="mc-session-dialog__msg">
            You will be signed out in
            <strong>{{ facade.sessionWarningSeconds() }}</strong>
            seconds due to inactivity.
          </p>
          <div class="mc-session-dialog__actions">
            <button mat-button type="button" (click)="onLogout()" data-test="session-logout">
              Sign out
            </button>
            <button mat-flat-button color="primary" type="button" (click)="onStay()" data-test="session-stay">
              Stay signed in
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .mc-session-overlay {
        position: fixed;
        inset: 0;
        z-index: var(--mc-z-modal);
        background: rgba(15, 21, 32, 0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--mc-space-4);
      }
      .mc-session-dialog {
        background: var(--mc-surface);
        border-radius: var(--mc-radius-xl);
        box-shadow: var(--mc-shadow-xl);
        padding: var(--mc-space-8);
        max-width: 400px;
        width: 100%;
        text-align: center;
      }
      .mc-session-dialog__icon {
        width: 56px;
        height: 56px;
        margin: 0 auto var(--mc-space-4);
        border-radius: var(--mc-radius-full);
        background: var(--mc-warning-50);
        color: var(--mc-warning-700);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .mc-session-dialog__icon mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
      .mc-session-dialog__msg {
        color: var(--mc-text-secondary);
        margin: var(--mc-space-3) 0 var(--mc-space-6);
        font-size: var(--mc-font-size-base);
      }
      .mc-session-dialog__actions {
        display: flex;
        justify-content: center;
        gap: var(--mc-space-2);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionTimeoutComponent {
  readonly facade = inject(AuthFacade);
  private readonly session = inject(SessionTimeoutService);

  onStay(): void {
    this.session.extend();
  }

  onLogout(): void {
    this.facade.logout();
  }
}
