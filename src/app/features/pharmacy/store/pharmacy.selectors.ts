import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PharmacyState } from './pharmacy.reducer';

export const selectPharmacyState = createFeatureSelector<PharmacyState>('pharmacy');
export const selectDrugs = createSelector(selectPharmacyState, (s) => s.drugs);
export const selectPrescriptions = createSelector(selectPharmacyState, (s) => s.prescriptions);
export const selectPharmacyLoading = createSelector(selectPharmacyState, (s) => s.loading);
export const selectPharmacySaving = createSelector(selectPharmacyState, (s) => s.saving);
export const selectPharmacyError = createSelector(selectPharmacyState, (s) => s.error);
export const selectLowStockCount = createSelector(
  selectDrugs,
  (drugs) => drugs.filter((d) => d.stockQty <= d.reorderLevel).length
);
export const selectPendingRxCount = createSelector(
  selectPrescriptions,
  (rx) => rx.filter((r) => r.status === 'Pending').length
);
