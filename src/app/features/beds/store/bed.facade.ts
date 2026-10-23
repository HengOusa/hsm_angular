import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { BedActions } from './bed.actions';
import {
  selectAllBeds,
  selectBedsLoading,
  selectWards,
  selectWardFilter,
  selectBedStatusFilter,
  selectHospitalTotals,
  selectBedsError,
} from './bed.selectors';
import { BedStatus } from '../domain/bed.entity';

@Injectable({ providedIn: 'root' })
export class BedFacade {
  private readonly store = inject(Store);

  readonly beds = this.store.selectSignal(selectAllBeds);
  readonly loading = this.store.selectSignal(selectBedsLoading);
  readonly wards = this.store.selectSignal(selectWards);
  readonly wardFilter = this.store.selectSignal(selectWardFilter);
  readonly statusFilter = this.store.selectSignal(selectBedStatusFilter);
  readonly totals = this.store.selectSignal(selectHospitalTotals);
  readonly error = this.store.selectSignal(selectBedsError);

  load(): void {
    this.store.dispatch(BedActions.load({}));
  }

  setWard(wardId: string): void {
    this.store.dispatch(BedActions.setWardFilter({ wardId }));
  }

  setStatus(status: BedStatus | 'ALL'): void {
    this.store.dispatch(BedActions.setStatusFilter({ status }));
  }

  updateStatus(
    id: string,
    status: BedStatus,
    patient?: { id: string; name: string } | null
  ): void {
    this.store.dispatch(BedActions.updateStatus({ id, status, patient }));
  }
}
