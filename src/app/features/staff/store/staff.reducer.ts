import { createReducer, on } from '@ngrx/store';
import { StaffMember, Shift } from '../domain/staff.entity';
import { StaffActions } from './staff.actions';

export interface StaffState {
  staff: StaffMember[];
  shifts: Shift[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialStaffState: StaffState = {
  staff: [],
  shifts: [],
  loading: false,
  saving: false,
  error: null,
};

export const staffReducer = createReducer(
  initialStaffState,

  on(StaffActions.load, (s) => ({ ...s, loading: true, error: null })),
  on(StaffActions.loadSuccess, (s, { staff, shifts }) => ({
    ...s,
    staff,
    shifts,
    loading: false,
  })),
  on(
    StaffActions.loadFailure,
    StaffActions.createShiftFailure,
    StaffActions.confirmShiftFailure,
    StaffActions.cancelShiftFailure,
    (s, { error }) => ({ ...s, loading: false, saving: false, error })
  ),

  on(StaffActions.createShift, StaffActions.confirmShift, StaffActions.cancelShift, (s) => ({
    ...s,
    saving: true,
    error: null,
  })),

  on(StaffActions.createShiftSuccess, (s, { shift }) => ({
    ...s,
    saving: false,
    shifts: [shift, ...s.shifts.filter((x) => x.id !== shift.id)],
  })),

  on(StaffActions.confirmShiftSuccess, StaffActions.cancelShiftSuccess, (s, { shift }) => ({
    ...s,
    saving: false,
    shifts: s.shifts.map((x) => (x.id === shift.id ? shift : x)),
  })),

  on(StaffActions.clearError, (s) => ({ ...s, error: null }))
);
