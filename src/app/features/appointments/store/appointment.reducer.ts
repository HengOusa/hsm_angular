import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Appointment, TimeSlot } from '../domain/appointment.entity';
import { AppointmentActions } from './appointment.actions';

export interface AppointmentsState extends EntityState<Appointment> {
  loading: boolean;
  saving: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  dateFilter: string;
  slots: TimeSlot[];
  slotsLoading: boolean;
}

export const appointmentAdapter = createEntityAdapter<Appointment>({
  selectId: (a) => a.id,
});

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export const initialAppointmentsState: AppointmentsState =
  appointmentAdapter.getInitialState({
    loading: false,
    saving: false,
    error: null,
    total: 0,
    page: 0,
    pageSize: 20,
    dateFilter: today(),
    slots: [],
    slotsLoading: false,
  });

export const appointmentsReducer = createReducer(
  initialAppointmentsState,

  on(AppointmentActions.search, (state, { criteria }) => ({
    ...state,
    loading: true,
    error: null,
    dateFilter: criteria.date ?? state.dateFilter,
    page: criteria.page ?? state.page,
    pageSize: criteria.pageSize ?? state.pageSize,
  })),

  on(AppointmentActions.searchSuccess, (state, { result }) =>
    appointmentAdapter.setAll(result.items, {
      ...state,
      loading: false,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    })
  ),

  on(AppointmentActions.searchFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AppointmentActions.create, (state) => ({
    ...state,
    saving: true,
    error: null,
  })),

  on(AppointmentActions.createSuccess, (state, { appointment }) =>
    appointmentAdapter.addOne(appointment, {
      ...state,
      saving: false,
      total: state.total + 1,
    })
  ),

  on(AppointmentActions.createFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  })),

  on(AppointmentActions.updateStatusSuccess, (state, { appointment }) =>
    appointmentAdapter.upsertOne(appointment, state)
  ),

  on(AppointmentActions.loadSlots, (state) => ({
    ...state,
    slotsLoading: true,
  })),

  on(AppointmentActions.loadSlotsSuccess, (state, { slots }) => ({
    ...state,
    slots,
    slotsLoading: false,
  })),

  on(AppointmentActions.loadSlotsFailure, (state, { error }) => ({
    ...state,
    slotsLoading: false,
    error,
  })),

  on(AppointmentActions.setDateFilter, (state, { date }) => ({
    ...state,
    dateFilter: date,
    page: 0,
  })),

  on(AppointmentActions.clearError, (state) => ({
    ...state,
    error: null,
  }))
);
