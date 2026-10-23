import { createReducer, on } from '@ngrx/store';
import { LabTest, LabTestCatalogItem } from '../domain/lab.entity';
import { LabActions } from './lab.actions';

export interface LabState {
  tests: LabTest[];
  catalog: LabTestCatalogItem[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialLabState: LabState = {
  tests: [],
  catalog: [],
  loading: false,
  saving: false,
  error: null,
};

export const labReducer = createReducer(
  initialLabState,

  on(LabActions.load, (s) => ({ ...s, loading: true, error: null })),
  on(LabActions.loadSuccess, (s, { tests }) => ({ ...s, tests, loading: false })),
  on(LabActions.loadCatalogSuccess, (s, { catalog }) => ({ ...s, catalog })),

  on(
    LabActions.loadFailure,
    LabActions.createOrderFailure,
    LabActions.updateStatusFailure,
    LabActions.enterResultFailure,
    (s, { error }) => ({ ...s, loading: false, saving: false, error })
  ),

  on(LabActions.createOrder, LabActions.updateStatus, LabActions.enterResult, (s) => ({
    ...s,
    saving: true,
    error: null,
  })),

  on(LabActions.createOrderSuccess, (s, { tests }) => ({
    ...s,
    saving: false,
    tests: [...tests, ...s.tests],
  })),

  on(LabActions.updateStatusSuccess, LabActions.enterResultSuccess, (s, { test }) => ({
    ...s,
    saving: false,
    tests: s.tests.map((t) => (t.id === test.id ? test : t)),
  })),

  on(LabActions.clearError, (s) => ({ ...s, error: null }))
);
