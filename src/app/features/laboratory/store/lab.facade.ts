import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { LabActions } from './lab.actions';
import {
  selectLabTests,
  selectLabCatalog,
  selectLabLoading,
  selectLabSaving,
  selectCriticalCount,
  selectPendingLabCount,
  selectLabError,
} from './lab.selectors';
import { LabSearchCriteria, LabTestStatus } from '../domain/lab.entity';

@Injectable({ providedIn: 'root' })
export class LabFacade {
  private readonly store = inject(Store);

  readonly tests = this.store.selectSignal(selectLabTests);
  readonly catalog = this.store.selectSignal(selectLabCatalog);
  readonly loading = this.store.selectSignal(selectLabLoading);
  readonly saving = this.store.selectSignal(selectLabSaving);
  readonly error = this.store.selectSignal(selectLabError);
  readonly criticalCount = this.store.selectSignal(selectCriticalCount);
  readonly pendingCount = this.store.selectSignal(selectPendingLabCount);

  load(criteria?: LabSearchCriteria): void {
    this.store.dispatch(LabActions.load({ criteria }));
  }

  createOrder(payload: {
    patientId: string;
    patientName: string;
    orderedBy: string;
    orderedByName: string;
    testCodes: string[];
  }): void {
    this.store.dispatch(LabActions.createOrder(payload));
  }

  updateStatus(id: string, status: LabTestStatus): void {
    this.store.dispatch(LabActions.updateStatus({ id, status }));
  }

  enterResult(
    id: string,
    result: string,
    reportedBy: string,
    numericResult?: number,
    notes?: string
  ): void {
    this.store.dispatch(
      LabActions.enterResult({ id, result, numericResult, reportedBy, notes })
    );
  }
}
