import { createFeatureSelector, createSelector } from '@ngrx/store';
import { patientAdapter, PatientsState } from './patient.reducer';

export const selectPatientsState = createFeatureSelector<PatientsState>('patients');

const { selectAll, selectEntities, selectIds, selectTotal } =
  patientAdapter.getSelectors(selectPatientsState);

export const selectAllPatients = selectAll;
export const selectPatientEntities = selectEntities;
export const selectPatientIds = selectIds;
export const selectPatientEntityTotal = selectTotal;

export const selectPatientsLoading = createSelector(
  selectPatientsState,
  (s) => s.loading
);
export const selectPatientsSaving = createSelector(selectPatientsState, (s) => s.saving);
export const selectPatientsError = createSelector(selectPatientsState, (s) => s.error);
export const selectPatientsTotal = createSelector(selectPatientsState, (s) => s.total);
export const selectPatientsPage = createSelector(selectPatientsState, (s) => s.page);
export const selectPatientsPageSize = createSelector(selectPatientsState, (s) => s.pageSize);
export const selectPatientsQuery = createSelector(selectPatientsState, (s) => s.query);
export const selectPatientsStatusFilter = createSelector(
  selectPatientsState,
  (s) => s.statusFilter
);
export const selectSelectedPatientId = createSelector(
  selectPatientsState,
  (s) => s.selectedId
);
export const selectSelectedPatient = createSelector(
  selectPatientEntities,
  selectSelectedPatientId,
  (entities, id) => (id ? entities[id] ?? null : null)
);
