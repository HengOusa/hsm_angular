import { createReducer, on } from '@ngrx/store';
import { Drug, Prescription } from '../domain/pharmacy.entity';
import { PharmacyActions } from './pharmacy.actions';

export interface PharmacyState {
  drugs: Drug[];
  prescriptions: Prescription[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  lowStockOnly: boolean;
  inventoryQuery: string;
}

export const initialPharmacyState: PharmacyState = {
  drugs: [],
  prescriptions: [],
  loading: false,
  saving: false,
  error: null,
  lowStockOnly: false,
  inventoryQuery: '',
};

export const pharmacyReducer = createReducer(
  initialPharmacyState,

  on(PharmacyActions.loadInventory, (s, { query, lowStockOnly }) => ({
    ...s,
    loading: true,
    error: null,
    inventoryQuery: query ?? s.inventoryQuery,
    lowStockOnly: lowStockOnly ?? s.lowStockOnly,
  })),

  on(PharmacyActions.loadInventorySuccess, (s, { drugs }) => ({
    ...s,
    drugs,
    loading: false,
  })),

  on(PharmacyActions.loadPrescriptions, (s) => ({
    ...s,
    loading: true,
    error: null,
  })),

  on(PharmacyActions.loadPrescriptionsSuccess, (s, { prescriptions }) => ({
    ...s,
    prescriptions,
    loading: false,
  })),

  on(
    PharmacyActions.loadInventoryFailure,
    PharmacyActions.loadPrescriptionsFailure,
    PharmacyActions.dispenseFailure,
    PharmacyActions.cancelRxFailure,
    (s, { error }) => ({ ...s, loading: false, saving: false, error })
  ),

  on(PharmacyActions.dispense, PharmacyActions.cancelRx, (s) => ({
    ...s,
    saving: true,
    error: null,
  })),

  on(PharmacyActions.dispenseSuccess, PharmacyActions.cancelRxSuccess, (s, { prescription }) => ({
    ...s,
    saving: false,
    prescriptions: s.prescriptions.map((p) =>
      p.id === prescription.id ? prescription : p
    ),
  })),

  on(PharmacyActions.clearError, (s) => ({ ...s, error: null }))
);
