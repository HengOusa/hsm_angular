import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BillingState } from './billing.reducer';

export const selectBillingState = createFeatureSelector<BillingState>('billing');
export const selectInvoices = createSelector(selectBillingState, (s) => s.invoices);
export const selectRevenue = createSelector(selectBillingState, (s) => s.revenue);
export const selectBillingLoading = createSelector(selectBillingState, (s) => s.loading);
export const selectBillingSaving = createSelector(selectBillingState, (s) => s.saving);
export const selectBillingError = createSelector(selectBillingState, (s) => s.error);
