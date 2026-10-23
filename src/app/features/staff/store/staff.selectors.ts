import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StaffState } from './staff.reducer';

export const selectStaffState = createFeatureSelector<StaffState>('staff');
export const selectStaffMembers = createSelector(selectStaffState, (s) => s.staff);
export const selectShifts = createSelector(selectStaffState, (s) => s.shifts);
export const selectStaffLoading = createSelector(selectStaffState, (s) => s.loading);
export const selectStaffSaving = createSelector(selectStaffState, (s) => s.saving);
export const selectStaffError = createSelector(selectStaffState, (s) => s.error);
export const selectConflictCount = createSelector(
  selectShifts,
  (shifts) => shifts.filter((s) => s.conflictIds.length > 0 && s.status !== 'Cancelled').length
);
export const selectTodayShiftCount = createSelector(selectShifts, (shifts) => {
  const today = new Date().toISOString().slice(0, 10);
  return shifts.filter((s) => s.date === today && s.status !== 'Cancelled').length;
});
