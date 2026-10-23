import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { PageHeaderComponent } from '../../../../shared';
import {
  bloodGroupValidator,
  phoneValidator,
  notFutureDateValidator,
} from '../../../../shared';
import { PatientFacade } from '../../store/patient.facade';
import { BloodGroup, Gender, PatientStatus } from '../../domain/patient.entity';

@Component({
  selector: 'mc-patient-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    PageHeaderComponent,
  ],
  templateUrl: './patient-registration.component.html',
  styleUrl: './patient-registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientRegistrationComponent {
  private readonly fb = inject(FormBuilder);
  readonly facade = inject(PatientFacade);

  readonly allergyInput = signal('');
  readonly conditionInput = signal('');

  readonly genders: Gender[] = ['Male', 'Female', 'Other', 'Unknown'];
  readonly bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  readonly statuses: PatientStatus[] = ['OPD', 'IPD', 'ICU', 'ER'];

  readonly personal = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    dateOfBirth: ['', [Validators.required, notFutureDateValidator()]],
    gender: ['Unknown' as Gender, Validators.required],
    bloodGroup: ['' as BloodGroup | '', bloodGroupValidator()],
    phone: ['', [Validators.required, phoneValidator()]],
    email: ['', Validators.email],
    address: [''],
  });

  readonly clinical = this.fb.nonNullable.group({
    status: ['OPD' as PatientStatus, Validators.required],
    allergies: this.fb.nonNullable.control<string[]>([]),
    chronicConditions: this.fb.nonNullable.control<string[]>([]),
  });

  readonly contacts = this.fb.nonNullable.group({
    emergencyName: [''],
    emergencyRelation: [''],
    emergencyPhone: ['', phoneValidator()],
    insuranceProvider: [''],
    insurancePolicy: [''],
    insuranceValidity: [''],
  });

  addAllergy(): void {
    const v = this.allergyInput().trim();
    if (!v) return;
    const list = this.clinical.controls.allergies.value;
    if (!list.includes(v)) {
      this.clinical.controls.allergies.setValue([...list, v]);
    }
    this.allergyInput.set('');
  }

  removeAllergy(item: string): void {
    this.clinical.controls.allergies.setValue(
      this.clinical.controls.allergies.value.filter((a) => a !== item)
    );
  }

  addCondition(): void {
    const v = this.conditionInput().trim();
    if (!v) return;
    const list = this.clinical.controls.chronicConditions.value;
    if (!list.includes(v)) {
      this.clinical.controls.chronicConditions.setValue([...list, v]);
    }
    this.conditionInput.set('');
  }

  removeCondition(item: string): void {
    this.clinical.controls.chronicConditions.setValue(
      this.clinical.controls.chronicConditions.value.filter((c) => c !== item)
    );
  }

  submit(): void {
    if (this.personal.invalid || this.clinical.invalid) {
      this.personal.markAllAsTouched();
      this.clinical.markAllAsTouched();
      return;
    }

    const p = this.personal.getRawValue();
    const c = this.clinical.getRawValue();
    const e = this.contacts.getRawValue();

    this.facade.create({
      firstName: p.firstName.trim(),
      lastName: p.lastName.trim(),
      dateOfBirth: p.dateOfBirth,
      gender: p.gender,
      bloodGroup: p.bloodGroup || undefined,
      phone: p.phone.trim(),
      email: p.email?.trim() || undefined,
      address: p.address?.trim() || undefined,
      allergies: c.allergies,
      chronicConditions: c.chronicConditions,
      status: c.status,
      emergencyContact:
        e.emergencyName && e.emergencyPhone
          ? {
              name: e.emergencyName.trim(),
              relation: e.emergencyRelation.trim() || 'Other',
              phone: e.emergencyPhone.trim(),
            }
          : undefined,
      insurance:
        e.insuranceProvider && e.insurancePolicy
          ? {
              provider: e.insuranceProvider.trim(),
              policyNumber: e.insurancePolicy.trim(),
              validity: e.insuranceValidity || new Date().toISOString().slice(0, 10),
            }
          : undefined,
    });
  }
}
