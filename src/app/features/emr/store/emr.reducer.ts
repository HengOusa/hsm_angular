import { createReducer, on } from '@ngrx/store';
import { SoapNote, VitalSigns, Icd10Code } from '../domain/emr.entity';
import { EmrActions } from './emr.actions';

export interface EmrState {
  notes: SoapNote[];
  vitals: VitalSigns[];
  icdResults: Icd10Code[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialEmrState: EmrState = {
  notes: [],
  vitals: [],
  icdResults: [],
  loading: false,
  saving: false,
  error: null,
};

export const emrReducer = createReducer(
  initialEmrState,

  on(EmrActions.loadNotes, EmrActions.loadVitals, (s) => ({
    ...s,
    loading: true,
    error: null,
  })),

  on(EmrActions.loadNotesSuccess, (s, { notes }) => ({
    ...s,
    notes,
    loading: false,
  })),

  on(EmrActions.loadVitalsSuccess, (s, { vitals }) => ({
    ...s,
    vitals,
    loading: false,
  })),

  on(
    EmrActions.loadNotesFailure,
    EmrActions.loadVitalsFailure,
    EmrActions.saveNoteFailure,
    EmrActions.saveVitalsFailure,
    (s, { error }) => ({ ...s, loading: false, saving: false, error })
  ),

  on(EmrActions.saveNote, EmrActions.saveVitals, (s) => ({
    ...s,
    saving: true,
    error: null,
  })),

  on(EmrActions.saveNoteSuccess, (s, { note }) => ({
    ...s,
    notes: [note, ...s.notes],
    saving: false,
  })),

  on(EmrActions.saveVitalsSuccess, (s, { vitals }) => ({
    ...s,
    vitals: [vitals, ...s.vitals],
    saving: false,
  })),

  on(EmrActions.searchIcdSuccess, (s, { results }) => ({
    ...s,
    icdResults: results,
  })),

  on(EmrActions.clearError, (s) => ({ ...s, error: null }))
);
