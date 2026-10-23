import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppointmentActions } from './appointment.actions';
import {
  selectAllAppointments,
  selectAppointmentsLoading,
  selectAppointmentsSaving,
  selectAppointmentsError,
  selectAppointmentsTotal,
  selectAppointmentsDateFilter,
  selectAppointmentSlots,
  selectSlotsLoading,
} from './appointment.selectors';
import { Appointment, AppointmentSearchCriteria } from '../domain/appointment.entity';

@Injectable({ providedIn: 'root' })
export class AppointmentFacade {
  private readonly store = inject(Store);

  readonly appointments = this.store.selectSignal(selectAllAppointments);
  readonly loading = this.store.selectSignal(selectAppointmentsLoading);
  readonly saving = this.store.selectSignal(selectAppointmentsSaving);
  readonly error = this.store.selectSignal(selectAppointmentsError);
  readonly total = this.store.selectSignal(selectAppointmentsTotal);
  readonly dateFilter = this.store.selectSignal(selectAppointmentsDateFilter);
  readonly slots = this.store.selectSignal(selectAppointmentSlots);
  readonly slotsLoading = this.store.selectSignal(selectSlotsLoading);

  search(criteria?: Partial<AppointmentSearchCriteria>): void {
    this.store.dispatch(
      AppointmentActions.search({
        criteria: {
          date: criteria?.date ?? this.dateFilter(),
          page: criteria?.page ?? 0,
          pageSize: criteria?.pageSize ?? 20,
          status: criteria?.status,
          doctorId: criteria?.doctorId,
          query: criteria?.query,
        },
      })
    );
  }

  setDate(date: string): void {
    this.store.dispatch(AppointmentActions.setDateFilter({ date }));
    this.search({ date, page: 0 });
  }

  create(
    appointment: Omit<
      Appointment,
      'id' | 'appointmentNumber' | 'createdAt' | 'updatedAt' | 'reminderSent'
    >
  ): void {
    this.store.dispatch(AppointmentActions.create({ appointment }));
  }

  updateStatus(id: string, status: Appointment['status']): void {
    this.store.dispatch(AppointmentActions.updateStatus({ id, status }));
  }

  loadSlots(doctorId: string, date: string): void {
    this.store.dispatch(AppointmentActions.loadSlots({ doctorId, date }));
  }

  clearError(): void {
    this.store.dispatch(AppointmentActions.clearError());
  }
}
