import { Observable } from 'rxjs';
import { Appointment, AppointmentSearchCriteria, TimeSlot } from './appointment.entity';

export interface AppointmentListResult {
  items: Appointment[];
  total: number;
  page: number;
  pageSize: number;
}

export abstract class AppointmentRepository {
  abstract search(criteria: AppointmentSearchCriteria): Observable<AppointmentListResult>;
  abstract getById(id: string): Observable<Appointment | null>;
  abstract create(
    input: Omit<Appointment, 'id' | 'appointmentNumber' | 'createdAt' | 'updatedAt' | 'reminderSent'>
  ): Observable<Appointment>;
  abstract updateStatus(id: string, status: Appointment['status']): Observable<Appointment>;
  abstract getSlots(doctorId: string, date: string): Observable<TimeSlot[]>;
  abstract checkConflict(
    doctorId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeId?: string
  ): Observable<boolean>;
}
