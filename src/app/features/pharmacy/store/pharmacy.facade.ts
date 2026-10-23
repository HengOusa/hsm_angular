import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { PharmacyActions } from './pharmacy.actions';
import {
  selectDrugs,
  selectPrescriptions,
  selectPharmacyLoading,
  selectPharmacySaving,
  selectPharmacyError,
  selectLowStockCount,
  selectPendingRxCount,
} from './pharmacy.selectors';
import { PrescriptionStatus } from '../domain/pharmacy.entity';

@Injectable({ providedIn: 'root' })
export class PharmacyFacade {
  private readonly store = inject(Store);

  readonly drugs = this.store.selectSignal(selectDrugs);
  readonly prescriptions = this.store.selectSignal(selectPrescriptions);
  readonly loading = this.store.selectSignal(selectPharmacyLoading);
  readonly saving = this.store.selectSignal(selectPharmacySaving);
  readonly error = this.store.selectSignal(selectPharmacyError);
  readonly lowStockCount = this.store.selectSignal(selectLowStockCount);
  readonly pendingRxCount = this.store.selectSignal(selectPendingRxCount);

  loadInventory(query?: string, lowStockOnly?: boolean): void {
    this.store.dispatch(PharmacyActions.loadInventory({ query, lowStockOnly }));
  }

  loadPrescriptions(status?: PrescriptionStatus | 'ALL'): void {
    this.store.dispatch(PharmacyActions.loadPrescriptions({ status }));
  }

  dispense(id: string, dispensedBy: string): void {
    this.store.dispatch(PharmacyActions.dispense({ id, dispensedBy }));
  }

  cancel(id: string): void {
    this.store.dispatch(PharmacyActions.cancelRx({ id }));
  }
}
