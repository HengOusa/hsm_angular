import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Appointment, AppointmentSearchCriteria, TimeSlot } from '../domain/appointment.entity';
import { AppointmentListResult } from '../domain/appointment.repository';

export const AppointmentActions = createActionGroup({
  source: 'Appointments',
  events: {
    'Search': props<{ criteria: AppointmentSearchCriteria }>(),
    'Search Success': props<{ result: AppointmentListResult }>(),
    'Search Failure': props<{ error: string }>(),

    'Create': props<{
      appointment: Omit<
        Appointment,
        'id' | 'appointmentNumber' | 'createdAt' | 'updatedAt' | 'reminderSent'
      >;
    }>(),
    'Create Success': props<{ appointment: Appointment }>(),
    'Create Failure': props<{ error: string }>(),

    'Update Status': props<{ id: string; status: Appointment['status'] }>(),
    'Update Status Success': props<{ appointment: Appointment }>(),
    'Update Status Failure': props<{ error: string }>(),

    'Load Slots': props<{ doctorId: string; date: string }>(),
    'Load Slots Success': props<{ slots: TimeSlot[] }>(),
    'Load slots Failure': props<{ error: string }>(),

    'Set Date Filter': props<{ date: string }>(),
    'Clear Error': emptyProps(),
  },
});
