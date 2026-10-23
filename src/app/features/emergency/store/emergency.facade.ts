import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { EmergencyActions } from './emergency.actions';
import {
  selectErCases,
  selectErLoading,
  selectErSaving,
  selectErError,
  selectErStatusFilter,
  selectErTriageFilter,
  selectImmediateCount,
  selectActiveCount,
} from './emergency.selectors';
import {
  EmergencyCase,
  EmergencyCaseStatus,
  TriageLevel,
} from '../domain/emergency.entity';

@Injectable({ providedIn: 'root' })
export class EmergencyFacade {
  private readonly store = inject(Store);

  readonly cases = this.store.selectSignal(selectErCases);
  readonly loading = this.store.selectSignal(selectErLoading);
  readonly saving = this.store.selectSignal(selectErSaving);
  readonly error = this.store.selectSignal(selectErError);
  readonly statusFilter = this.store.selectSignal(selectErStatusFilter);
  readonly triageFilter = this.store.selectSignal(selectErTriageFilter);
  readonly immediateCount = this.store.selectSignal(selectImmediateCount);
  readonly activeCount = this.store.selectSignal(selectActiveCount);

  load(): void {
    this.store.dispatch(EmergencyActions.load({}));
  }

  setStatusFilter(status: EmergencyCaseStatus | 'ACTIVE' | 'ALL'): void {
    this.store.dispatch(EmergencyActions.setStatusFilter({ status }));
  }

  setTriageFilter(triage: TriageLevel | 'ALL'): void {
    this.store.dispatch(EmergencyActions.setTriageFilter({ triage }));
  }

  create(
    c: Omit<
      EmergencyCase,
      'id' | 'caseNumber' | 'createdAt' | 'updatedAt' | 'teamMembers' | 'interventions'
    > & { teamMembers?: string[]; interventions?: string[] }
  ): void {
    this.store.dispatch(EmergencyActions.create({ case: c }));
  }

  update(id: string, patch: Partial<EmergencyCase>): void {
    this.store.dispatch(EmergencyActions.update({ id, patch }));
  }

  activateTrauma(id: string): void {
    this.store.dispatch(EmergencyActions.activateTrauma({ id }));
  }
}
