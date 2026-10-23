import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'mc-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div class="mc-forgot" data-test="forgot-page">
      <div class="mc-forgot__card">
        <div class="mc-forgot__icon"><mat-icon>lock_reset</mat-icon></div>
        <h1 class="mc-h2">Reset password</h1>
        <p class="mc-text-secondary mc-body-sm">
          Enter your work email. We’ll send a one-time code (OTP) to verify it’s you.
        </p>

        @if (step() === 'email') {
          <form [formGroup]="form" (ngSubmit)="onSendOtp()" class="mc-forgot__form">
            <mat-form-field appearance="outline" class="mc-forgot__field">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" data-test="forgot-email" />
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid" data-test="forgot-send">
              Send OTP
            </button>
          </form>
        } @else {
          <form [formGroup]="otpForm" (ngSubmit)="onVerify()" class="mc-forgot__form">
            <mat-form-field appearance="outline" class="mc-forgot__field">
              <mat-label>OTP code</mat-label>
              <input matInput formControlName="otp" maxlength="6" data-test="forgot-otp" />
              <mat-icon matPrefix>pin</mat-icon>
            </mat-form-field>
            <button mat-flat-button color="primary" type="submit" [disabled]="otpForm.invalid" data-test="forgot-verify">
              Verify & continue
            </button>
          </form>
        }

        <a routerLink="/auth/login" class="mc-forgot__back">Back to login</a>
      </div>
    </div>
  `,
  styles: [`
    .mc-forgot {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--mc-space-4);
      background: linear-gradient(135deg, var(--mc-primary-900), var(--mc-primary-700));
    }
    .mc-forgot__card {
      width: 100%;
      max-width: 420px;
      background: var(--mc-surface);
      border-radius: var(--mc-radius-xl);
      padding: var(--mc-space-8);
      box-shadow: var(--mc-shadow-xl);
      text-align: center;
    }
    .mc-forgot__icon {
      width: 56px; height: 56px; margin: 0 auto var(--mc-space-3);
      border-radius: var(--mc-radius-lg); background: var(--mc-primary-50);
      color: var(--mc-primary-800); display: flex; align-items: center; justify-content: center;
    }
    .mc-forgot__form { display: flex; flex-direction: column; gap: var(--mc-space-2); margin-top: var(--mc-space-4); text-align: left; }
    .mc-forgot__field { width: 100%; }
    .mc-forgot__back { display: inline-block; margin-top: var(--mc-space-4); color: var(--mc-primary-800); font-size: var(--mc-font-size-sm); text-decoration: none; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly notify = inject(NotificationService);

  readonly step = signal<'email' | 'otp'>('email');

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly otpForm = this.fb.nonNullable.group({
    otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  onSendOtp(): void {
    if (this.form.invalid) return;
    this.notify.success('OTP sent (demo: use 123456)');
    this.step.set('otp');
  }

  onVerify(): void {
    if (this.otpForm.invalid) return;
    if (this.otpForm.value.otp === '123456') {
      this.notify.success('Verified. Password reset flow continues in production.');
    } else {
      this.notify.error('Invalid OTP. Demo code is 123456.');
    }
  }
}
