import { createFeatureSelector, createSelector } from '@ngrx/store';
import { appointmentAdapter, AppointmentsState } from './appointment.reducer';

export const selectAppointmentsState =
  createFeatureSelector<AppointmentsState>('appointments');

const { selectAll, selectEntities } = appointmentAdapter.getSelectors(selectAppointmentsState);

export const selectAllAppointments = selectAll;
export const selectAppointmentEntities = selectEntities;
export const selectAppointmentsLoading = createSelector(
  selectAppointmentsState,
  (s) => s.loading
);
export const selectAppointmentsSaving = createSelector(selectAppointmentsState, (s) => s.saving);
export const selectAppointmentsError = createSelector(selectAppointmentsState, (s) => s.error);
export const selectAppointmentsTotal = createSelector(selectAppointmentsState, (s) => s.total);
export const selectAppointmentsDateFilter = createSelector(
  selectAppointmentsState,
  (s) => s.dateFilter
);
export const selectAppointmentSlots = createSelector(selectAppointmentsState, (s) => s.slots);
export const selectSlotsLoading = createSelector(selectAppointmentsState, (s) => s.slotsLoading);
