import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmrState } from './emr.reducer';

export const selectEmrState = createFeatureSelector<EmrState>('emr');
export const selectSoapNotes = createSelector(selectEmrState, (s) => s.notes);
export const selectVitalsList = createSelector(selectEmrState, (s) => s.vitals);
export const selectIcdResults = createSelector(selectEmrState, (s) => s.icdResults);
export const selectEmrLoading = createSelector(selectEmrState, (s) => s.loading);
export const selectEmrSaving = createSelector(selectEmrState, (s) => s.saving);
export const selectEmrError = createSelector(selectEmrState, (s) => s.error);
