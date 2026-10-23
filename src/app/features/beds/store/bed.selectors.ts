import { createFeatureSelector, createSelector } from '@ngrx/store';
import { bedAdapter, BedsState } from './bed.reducer';

export const selectBedsState = createFeatureSelector<BedsState>('beds');

const { selectAll } = bedAdapter.getSelectors(selectBedsState);

export const selectAllBeds = selectAll;
export const selectBedsLoading = createSelector(selectBedsState, (s) => s.loading);
export const selectBedsError = createSelector(selectBedsState, (s) => s.error);
export const selectWards = createSelector(selectBedsState, (s) => s.wards);
export const selectWardFilter = createSelector(selectBedsState, (s) => s.wardFilter);
export const selectBedStatusFilter = createSelector(selectBedsState, (s) => s.statusFilter);

export const selectHospitalTotals = createSelector(selectWards, (wards) => {
  return wards.reduce(
    (acc, w) => ({
      total: acc.total + w.total,
      available: acc.available + w.available,
      occupied: acc.occupied + w.occupied,
    }),
    { total: 0, available: 0, occupied: 0 }
  );
});
