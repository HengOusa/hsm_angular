import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuditState } from './audit.reducer';

export const selectAuditState = createFeatureSelector<AuditState>('audit');
export const selectAuditEntries = createSelector(selectAuditState, (s) => s.entries);
export const selectAuditLoading = createSelector(selectAuditState, (s) => s.loading);
