import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { signal } from '@angular/core';
import { AuthFacade } from '../../../store/auth/auth.facade';
import { UserRole } from '../../../core/auth/auth.service';

@Component({
  selector: 'mc-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthFacade);

  readonly hidePassword = signal(true);
  readonly isLoading = this.auth.isLoading;
  readonly error = this.auth.error;

  readonly roles: { value: UserRole; label: string }[] = [
    { value: 'DOCTOR', label: 'Doctor' },
    { value: 'NURSE', label: 'Nurse' },
    { value: 'RECEPTIONIST', label: 'Receptionist' },
    { value: 'HOSPITAL_ADMIN', label: 'Hospital Admin' },
    { value: 'PHARMACIST', label: 'Pharmacist' },
    { value: 'LAB_TECHNICIAN', label: 'Lab Technician' },
    { value: 'SUPER_ADMIN', label: 'Super Admin' },
  ];

  readonly form = this.fb.nonNullable.group({
    email: ['doctor@medicore.demo', [Validators.required, Validators.email]],
    password: ['demo1234', [Validators.required, Validators.minLength(6)]],
    role: ['DOCTOR' as UserRole, Validators.required],
  });

  constructor() {
    // Clear previous auth error when form changes
    effect(() => {
      if (this.error()) {
        // keep displayed until next submit
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.auth.clearError();
    const { email, password, role } = this.form.getRawValue();
    this.auth.login({ email, password, role });
  }
}
