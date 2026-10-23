import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Patient, PatientStatus } from '../domain/patient.entity';
import { PatientActions } from './patient.actions';

export interface PatientsState extends EntityState<Patient> {
  selectedId: string | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  query: string;
  statusFilter: PatientStatus | 'ALL';
}

export const patientAdapter = createEntityAdapter<Patient>({
  selectId: (p) => p.id,
  sortComparer: (a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
});

export const initialPatientsState: PatientsState = patientAdapter.getInitialState({
  selectedId: null,
  loading: false,
  saving: false,
  error: null,
  total: 0,
  page: 0,
  pageSize: 10,
  query: '',
  statusFilter: 'ALL',
});

export const patientsReducer = createReducer(
  initialPatientsState,

  on(PatientActions.search, (state, { criteria }) => ({
    ...state,
    loading: true,
    error: null,
    query: criteria.query ?? state.query,
    statusFilter: criteria.status ?? state.statusFilter,
    page: criteria.page ?? state.page,
    pageSize: criteria.pageSize ?? state.pageSize,
  })),

  on(PatientActions.searchSuccess, (state, { result }) =>
    patientAdapter.setAll(result.items, {
      ...state,
      loading: false,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    })
  ),

  on(PatientActions.searchFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(PatientActions.loadOne, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(PatientActions.loadOneSuccess, (state, { patient }) =>
    patientAdapter.upsertOne(patient, {
      ...state,
      loading: false,
      selectedId: patient.id,
    })
  ),

  on(PatientActions.loadOneFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(PatientActions.create, (state) => ({
    ...state,
    saving: true,
    error: null,
  })),

  on(PatientActions.createSuccess, (state, { patient }) =>
    patientAdapter.addOne(patient, {
      ...state,
      saving: false,
      total: state.total + 1,
      selectedId: patient.id,
    })
  ),

  on(PatientActions.createFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  })),

  on(PatientActions.update, (state) => ({
    ...state,
    saving: true,
    error: null,
  })),

  on(PatientActions.updateSuccess, (state, { patient }) =>
    patientAdapter.upsertOne(patient, {
      ...state,
      saving: false,
    })
  ),

  on(PatientActions.updateFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  })),

  on(PatientActions.deleteSuccess, (state, { id }) =>
    patientAdapter.removeOne(id, {
      ...state,
      total: Math.max(0, state.total - 1),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })
  ),

  on(PatientActions.setStatusFilter, (state, { status }) => ({
    ...state,
    statusFilter: status,
    page: 0,
  })),

  on(PatientActions.setQuery, (state, { query }) => ({
    ...state,
    query,
    page: 0,
  })),

  on(PatientActions.clearSelected, (state) => ({
    ...state,
    selectedId: null,
  }))
);
