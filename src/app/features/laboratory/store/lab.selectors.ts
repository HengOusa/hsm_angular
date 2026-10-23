import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LabState } from './lab.reducer';

export const selectLabState = createFeatureSelector<LabState>('lab');
export const selectLabTests = createSelector(selectLabState, (s) => s.tests);
export const selectLabCatalog = createSelector(selectLabState, (s) => s.catalog);
export const selectLabLoading = createSelector(selectLabState, (s) => s.loading);
export const selectLabSaving = createSelector(selectLabState, (s) => s.saving);
export const selectLabError = createSelector(selectLabState, (s) => s.error);
export const selectCriticalCount = createSelector(
  selectLabTests,
  (tests) => tests.filter((t) => t.isCritical).length
);
export const selectPendingLabCount = createSelector(
  selectLabTests,
  (tests) => tests.filter((t) => t.status !== 'Reported' && t.status !== 'Completed').length
);
