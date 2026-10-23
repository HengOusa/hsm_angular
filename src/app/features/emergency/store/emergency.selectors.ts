import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmergencyState } from './emergency.reducer';

export const selectEmergencyState = createFeatureSelector<EmergencyState>('emergency');
export const selectErCases = createSelector(selectEmergencyState, (s) => s.cases);
export const selectErLoading = createSelector(selectEmergencyState, (s) => s.loading);
export const selectErSaving = createSelector(selectEmergencyState, (s) => s.saving);
export const selectErError = createSelector(selectEmergencyState, (s) => s.error);
export const selectErStatusFilter = createSelector(selectEmergencyState, (s) => s.statusFilter);
export const selectErTriageFilter = createSelector(selectEmergencyState, (s) => s.triageFilter);

export const selectImmediateCount = createSelector(
  selectErCases,
  (cases) =>
    cases.filter(
      (c) =>
        c.triageLevel === 'Immediate' &&
        (c.status === 'Triaging' || c.status === 'InProgress')
    ).length
);

export const selectActiveCount = createSelector(
  selectErCases,
  (cases) => cases.filter((c) => c.status === 'Triaging' || c.status === 'InProgress').length
);
