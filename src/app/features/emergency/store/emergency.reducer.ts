import { createReducer, on } from '@ngrx/store';
import { EmergencyCase, TriageLevel, EmergencyCaseStatus } from '../domain/emergency.entity';
import { EmergencyActions } from './emergency.actions';

export interface EmergencyState {
  cases: EmergencyCase[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  statusFilter: EmergencyCaseStatus | 'ACTIVE' | 'ALL';
  triageFilter: TriageLevel | 'ALL';
}

export const initialEmergencyState: EmergencyState = {
  cases: [],
  loading: false,
  saving: false,
  error: null,
  statusFilter: 'ACTIVE',
  triageFilter: 'ALL',
};

export const emergencyReducer = createReducer(
  initialEmergencyState,

  on(EmergencyActions.load, (s) => ({ ...s, loading: true, error: null })),
  on(EmergencyActions.loadSuccess, (s, { cases }) => ({
    ...s,
    cases,
    loading: false,
  })),
  on(
    EmergencyActions.loadFailure,
    EmergencyActions.createFailure,
    EmergencyActions.updateFailure,
    EmergencyActions.activateTraumaFailure,
    (s, { error }) => ({ ...s, loading: false, saving: false, error })
  ),

  on(EmergencyActions.create, EmergencyActions.update, EmergencyActions.activateTrauma, (s) => ({
    ...s,
    saving: true,
    error: null,
  })),

  on(EmergencyActions.createSuccess, (s, { case: c }) => ({
    ...s,
    saving: false,
    cases: [c, ...s.cases],
  })),

  on(
    EmergencyActions.updateSuccess,
    EmergencyActions.activateTraumaSuccess,
    (s, { case: c }) => ({
      ...s,
      saving: false,
      cases: s.cases.map((x) => (x.id === c.id ? c : x)),
    })
  ),

  on(EmergencyActions.setStatusFilter, (s, { status }) => ({
    ...s,
    statusFilter: status,
  })),

  on(EmergencyActions.setTriageFilter, (s, { triage }) => ({
    ...s,
    triageFilter: triage,
  })),

  on(EmergencyActions.clearError, (s) => ({ ...s, error: null }))
);
