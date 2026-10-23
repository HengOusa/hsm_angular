import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { AppointmentRepository, AppointmentListResult } from '../domain/appointment.repository';
import {
  Appointment,
  AppointmentSearchCriteria,
  TimeSlot,
  appointmentsConflict,
} from '../domain/appointment.entity';

function todayOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const SEED: Appointment[] = [
  {
    id: 'apt-001',
    appointmentNumber: 'APT-2026-0001',
    patientId: 'pat-002',
    patientName: 'James Okello',
    doctorId: 'doc-001',
    doctorName: 'Dr. Sarah Chen',
    departmentId: 'dept-cardio',
    departmentName: 'Cardiology',
    type: 'Scheduled',
    date: todayOffset(0),
    startTime: '09:00',
    endTime: '09:30',
    durationMinutes: 30,
    status: 'Confirmed',
    chiefComplaint: 'Chest discomfort on exertion',
    reminderSent: true,
    createdBy: 'usr-001',
    createdAt: '2026-10-18T10:00:00Z',
    updatedAt: '2026-10-19T08:00:00Z',
  },
  {
    id: 'apt-002',
    appointmentNumber: 'APT-2026-0002',
    patientId: 'pat-006',
    patientName: 'Lucas Berg',
    doctorId: 'doc-001',
    doctorName: 'Dr. Sarah Chen',
    departmentId: 'dept-cardio',
    departmentName: 'Cardiology',
    type: 'Scheduled',
    date: todayOffset(0),
    startTime: '10:00',
    endTime: '10:30',
    durationMinutes: 30,
    status: 'Pending',
    chiefComplaint: 'Follow-up hypertension',
    reminderSent: false,
    createdBy: 'usr-001',
    createdAt: '2026-10-19T11:00:00Z',
    updatedAt: '2026-10-19T11:00:00Z',
  },
  {
    id: 'apt-003',
    appointmentNumber: 'APT-2026-0003',
    patientId: 'pat-001',
    patientName: 'Amina Hassan',
    doctorId: 'doc-002',
    doctorName: 'Dr. Raj Patel',
    departmentId: 'dept-general',
    departmentName: 'General Medicine',
    type: 'Telemedicine',
    date: todayOffset(1),
    startTime: '14:00',
    endTime: '14:20',
    durationMinutes: 20,
    status: 'Confirmed',
    chiefComplaint: 'Medication review',
    reminderSent: true,
    createdBy: 'usr-001',
    createdAt: '2026-10-19T09:00:00Z',
    updatedAt: '2026-10-19T09:00:00Z',
  },
  {
    id: 'apt-004',
    appointmentNumber: 'APT-2026-0004',
    patientId: 'pat-003',
    patientName: 'Sofia Martinez',
    doctorId: 'doc-003',
    doctorName: 'Dr. Emily Wright',
    departmentId: 'dept-er',
    departmentName: 'Emergency',
    type: 'Emergency',
    date: todayOffset(0),
    startTime: '07:30',
    endTime: '08:00',
    durationMinutes: 30,
    status: 'Completed',
    chiefComplaint: 'Acute abdominal pain',
    reminderSent: false,
    createdBy: 'usr-001',
    createdAt: '2026-10-20T06:30:00Z',
    updatedAt: '2026-10-20T08:00:00Z',
  },
  {
    id: 'apt-005',
    appointmentNumber: 'APT-2026-0005',
    patientId: 'pat-002',
    patientName: 'James Okello',
    doctorId: 'doc-002',
    doctorName: 'Dr. Raj Patel',
    departmentId: 'dept-general',
    departmentName: 'General Medicine',
    type: 'WalkIn',
    date: todayOffset(0),
    startTime: '11:00',
    endTime: '11:15',
    durationMinutes: 15,
    status: 'InProgress',
    chiefComplaint: 'Blood sugar check',
    reminderSent: false,
    createdBy: 'usr-001',
    createdAt: '2026-10-20T10:45:00Z',
    updatedAt: '2026-10-20T11:00:00Z',
  },
];

const SLOT_TIMES = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

@Injectable({ providedIn: 'root' })
export class AppointmentMockRepository extends AppointmentRepository {
  private items = [...SEED];
  private seq = 6;

  search(criteria: AppointmentSearchCriteria): Observable<AppointmentListResult> {
    const page = criteria.page ?? 0;
    const pageSize = criteria.pageSize ?? 20;
    let filtered = [...this.items];

    if (criteria.date) {
      filtered = filtered.filter((a) => a.date === criteria.date);
    }
    if (criteria.doctorId) {
      filtered = filtered.filter((a) => a.doctorId === criteria.doctorId);
    }
    if (criteria.status && criteria.status !== 'ALL') {
      filtered = filtered.filter((a) => a.status === criteria.status);
    }
    if (criteria.query?.trim()) {
      const q = criteria.query.trim().toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.patientName.toLowerCase().includes(q) ||
          a.appointmentNumber.toLowerCase().includes(q) ||
          a.doctorName.toLowerCase().includes(q)
      );
    }

    filtered.sort((a, b) => {
      const d = a.date.localeCompare(b.date);
      return d !== 0 ? d : a.startTime.localeCompare(b.startTime);
    });

    const total = filtered.length;
    const items = filtered.slice(page * pageSize, page * pageSize + pageSize);
    return of({ items, total, page, pageSize }).pipe(delay(220));
  }

  getById(id: string): Observable<Appointment | null> {
    return of(this.items.find((a) => a.id === id) ?? null).pipe(delay(100));
  }

  create(
    input: Omit<Appointment, 'id' | 'appointmentNumber' | 'createdAt' | 'updatedAt' | 'reminderSent'>
  ): Observable<Appointment> {
    const conflict = this.items.some(
      (existing) =>
        appointmentsConflict(
          {
            ...existing,
          } as Appointment,
          {
            ...input,
            id: 'new',
            appointmentNumber: '',
            reminderSent: false,
            createdAt: '',
            updatedAt: '',
          } as Appointment
        )
    );
    if (conflict) {
      throw new Error('Time slot conflicts with an existing appointment for this doctor.');
    }

    const now = new Date().toISOString();
    const apt: Appointment = {
      ...input,
      id: `apt-${String(this.seq).padStart(3, '0')}`,
      appointmentNumber: `APT-2026-${String(this.seq).padStart(4, '0')}`,
      reminderSent: false,
      createdAt: now,
      updatedAt: now,
    };
    this.seq++;
    this.items = [...this.items, apt];
    return of(apt).pipe(delay(350));
  }

  updateStatus(id: string, status: Appointment['status']): Observable<Appointment> {
    const idx = this.items.findIndex((a) => a.id === id);
    if (idx < 0) throw new Error('Appointment not found');
    const updated: Appointment = {
      ...this.items[idx],
      status,
      updatedAt: new Date().toISOString(),
    };
    this.items = [...this.items.slice(0, idx), updated, ...this.items.slice(idx + 1)];
    return of(updated).pipe(delay(200));
  }

  getSlots(doctorId: string, date: string): Observable<TimeSlot[]> {
    const booked = this.items.filter(
      (a) => a.doctorId === doctorId && a.date === date && a.status !== 'Cancelled'
    );
    const slots: TimeSlot[] = SLOT_TIMES.map((start) => {
      const [h, m] = start.split(':').map(Number);
      const endM = m + 30;
      const end =
        endM >= 60
          ? `${String(h + 1).padStart(2, '0')}:00`
          : `${String(h).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
      const available = !booked.some((a) => a.startTime < end && start < a.endTime);
      return { startTime: start, endTime: end, available };
    });
    return of(slots).pipe(delay(150));
  }

  checkConflict(
    doctorId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeId?: string
  ): Observable<boolean> {
    const conflict = this.items.some(
      (a) =>
        a.id !== excludeId &&
        a.doctorId === doctorId &&
        a.date === date &&
        a.status !== 'Cancelled' &&
        a.startTime < endTime &&
        startTime < a.endTime
    );
    return of(conflict).pipe(delay(50));
  }
}
