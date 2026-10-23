import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { EmrActions } from './emr.actions';
import {
  selectSoapNotes,
  selectVitalsList,
  selectIcdResults,
  selectEmrLoading,
  selectEmrSaving,
  selectEmrError,
} from './emr.selectors';
import { SoapNote, VitalSigns } from '../domain/emr.entity';

@Injectable({ providedIn: 'root' })
export class EmrFacade {
  private readonly store = inject(Store);

  readonly notes = this.store.selectSignal(selectSoapNotes);
  readonly vitals = this.store.selectSignal(selectVitalsList);
  readonly icdResults = this.store.selectSignal(selectIcdResults);
  readonly loading = this.store.selectSignal(selectEmrLoading);
  readonly saving = this.store.selectSignal(selectEmrSaving);
  readonly error = this.store.selectSignal(selectEmrError);

  loadNotes(patientId?: string): void {
    this.store.dispatch(EmrActions.loadNotes({ patientId }));
  }

  loadVitals(patientId?: string): void {
    this.store.dispatch(EmrActions.loadVitals({ patientId }));
  }

  saveNote(note: Omit<SoapNote, 'id' | 'createdAt' | 'updatedAt'>): void {
    this.store.dispatch(EmrActions.saveNote({ note }));
  }

  saveVitals(
    vitals: Omit<VitalSigns, 'id' | 'bmi' | 'isAbnormal' | 'abnormalFlags'>
  ): void {
    this.store.dispatch(EmrActions.saveVitals({ vitals }));
  }

  searchIcd(query: string): void {
    this.store.dispatch(EmrActions.searchIcd({ query }));
  }
}
