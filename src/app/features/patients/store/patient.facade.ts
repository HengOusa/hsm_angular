import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { PatientActions } from './patient.actions';
import {
  selectAllPatients,
  selectPatientsLoading,
  selectPatientsSaving,
  selectPatientsError,
  selectPatientsTotal,
  selectPatientsPage,
  selectPatientsPageSize,
  selectPatientsQuery,
  selectPatientsStatusFilter,
  selectSelectedPatient,
} from './patient.selectors';
import { Patient, PatientSearchCriteria, PatientStatus } from '../domain/patient.entity';

@Injectable({ providedIn: 'root' })
export class PatientFacade {
  private readonly store = inject(Store);

  readonly patients = this.store.selectSignal(selectAllPatients);
  readonly loading = this.store.selectSignal(selectPatientsLoading);
  readonly saving = this.store.selectSignal(selectPatientsSaving);
  readonly error = this.store.selectSignal(selectPatientsError);
  readonly total = this.store.selectSignal(selectPatientsTotal);
  readonly page = this.store.selectSignal(selectPatientsPage);
  readonly pageSize = this.store.selectSignal(selectPatientsPageSize);
  readonly query = this.store.selectSignal(selectPatientsQuery);
  readonly statusFilter = this.store.selectSignal(selectPatientsStatusFilter);
  readonly selected = this.store.selectSignal(selectSelectedPatient);

  search(criteria?: Partial<PatientSearchCriteria>): void {
    this.store.dispatch(
      PatientActions.search({
        criteria: {
          query: criteria?.query ?? this.query(),
          status: criteria?.status ?? this.statusFilter(),
          page: criteria?.page ?? this.page(),
          pageSize: criteria?.pageSize ?? this.pageSize(),
        },
      })
    );
  }

  setQuery(query: string): void {
    this.store.dispatch(PatientActions.setQuery({ query }));
    this.search({ query, page: 0 });
  }

  setStatusFilter(status: PatientStatus | 'ALL'): void {
    this.store.dispatch(PatientActions.setStatusFilter({ status }));
    this.search({ status, page: 0 });
  }

  setPage(page: number): void {
    this.search({ page });
  }

  loadOne(id: string): void {
    this.store.dispatch(PatientActions.loadOne({ id }));
  }

  create(patient: Omit<Patient, 'id' | 'mrn' | 'createdAt' | 'updatedAt'>): void {
    this.store.dispatch(PatientActions.create({ patient }));
  }

  update(id: string, patch: Partial<Patient>): void {
    this.store.dispatch(PatientActions.update({ id, patch }));
  }

  delete(id: string): void {
    this.store.dispatch(PatientActions.delete({ id }));
  }

  clearSelected(): void {
    this.store.dispatch(PatientActions.clearSelected());
  }
}
