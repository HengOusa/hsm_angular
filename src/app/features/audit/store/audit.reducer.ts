import { createReducer, on } from '@ngrx/store';
import { AuditEntry } from '../domain/audit.entity';
import { AuditActions } from './audit.actions';

export interface AuditState {
  entries: AuditEntry[];
  loading: boolean;
  error: string | null;
}

export const initialAuditState: AuditState = {
  entries: [],
  loading: false,
  error: null,
};

export const auditReducer = createReducer(
  initialAuditState,
  on(AuditActions.load, (s) => ({ ...s, loading: true, error: null })),
  on(AuditActions.loadSuccess, (s, { entries }) => ({
    ...s,
    entries,
    loading: false,
  })),
  on(AuditActions.loadFailure, (s, { error }) => ({
    ...s,
    loading: false,
    error,
  })),
  on(AuditActions.clearError, (s) => ({ ...s, error: null }))
);
