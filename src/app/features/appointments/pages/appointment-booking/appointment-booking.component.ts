import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent, AlertBannerComponent } from '../../../../shared';
import { AppointmentFacade } from '../../store/appointment.facade';
import { AuthFacade } from '../../../../store/auth/auth.facade';
import { AppointmentType } from '../../domain/appointment.entity';

interface DoctorOption {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
}

interface PatientOption {
  id: string;
  name: string;
}

@Component({
  selector: 'mc-appointment-booking',
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
    PageHeaderComponent,
    AlertBannerComponent,
  ],
  templateUrl: './appointment-booking.component.html',
  styleUrl: './appointment-booking.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentBookingComponent {
  private readonly fb = inject(FormBuilder);
  readonly facade = inject(AppointmentFacade);
  private readonly auth = inject(AuthFacade);

  readonly selectedSlot = signal<string | null>(null);

  readonly doctors: DoctorOption[] = [
    { id: 'doc-001', name: 'Dr. Sarah Chen', departmentId: 'dept-cardio', departmentName: 'Cardiology' },
    { id: 'doc-002', name: 'Dr. Raj Patel', departmentId: 'dept-general', departmentName: 'General Medicine' },
    { id: 'doc-003', name: 'Dr. Emily Wright', departmentId: 'dept-er', departmentName: 'Emergency' },
  ];

  readonly patients: PatientOption[] = [
    { id: 'pat-001', name: 'Amina Hassan' },
    { id: 'pat-002', name: 'James Okello' },
    { id: 'pat-003', name: 'Sofia Martinez' },
    { id: 'pat-006', name: 'Lucas Berg' },
  ];

  readonly types: AppointmentType[] = ['Scheduled', 'WalkIn', 'Telemedicine', 'Emergency'];

  readonly form = this.fb.nonNullable.group({
    patientId: ['', Validators.required],
    doctorId: ['doc-001', Validators.required],
    date: [new Date().toISOString().slice(0, 10), Validators.required],
    type: ['Scheduled' as AppointmentType, Validators.required],
    chiefComplaint: [''],
    notes: [''],
  });

  constructor() {
    effect(() => {
      const doctorId = this.form.controls.doctorId.value;
      const date = this.form.controls.date.value;
      if (doctorId && date) {
        this.facade.loadSlots(doctorId, date);
        this.selectedSlot.set(null);
      }
    });

    // Also react to form value changes outside signals
    this.form.controls.doctorId.valueChanges.subscribe(() => this.reloadSlots());
    this.form.controls.date.valueChanges.subscribe(() => this.reloadSlots());
  }

  private reloadSlots(): void {
    const doctorId = this.form.controls.doctorId.value;
    const date = this.form.controls.date.value;
    if (doctorId && date) {
      this.facade.loadSlots(doctorId, date);
      this.selectedSlot.set(null);
    }
  }

  pickSlot(start: string, available: boolean): void {
    if (!available) return;
    this.selectedSlot.set(start);
  }

  submit(): void {
    if (this.form.invalid || !this.selectedSlot()) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const doctor = this.doctors.find((d) => d.id === v.doctorId)!;
    const patient = this.patients.find((p) => p.id === v.patientId)!;
    const start = this.selectedSlot()!;
    const slot = this.facade.slots().find((s) => s.startTime === start);
    const end = slot?.endTime ?? this.addThirty(start);

    this.facade.create({
      patientId: v.patientId,
      patientName: patient.name,
      doctorId: v.doctorId,
      doctorName: doctor.name,
      departmentId: doctor.departmentId,
      departmentName: doctor.departmentName,
      type: v.type,
      date: v.date,
      startTime: start,
      endTime: end,
      durationMinutes: 30,
      status: 'Pending',
      chiefComplaint: v.chiefComplaint?.trim() || undefined,
      notes: v.notes?.trim() || undefined,
      createdBy: this.auth.user()?.id ?? 'usr-001',
    });
  }

  private addThirty(start: string): string {
    const [h, m] = start.split(':').map(Number);
    const total = h * 60 + m + 30;
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  }
}
