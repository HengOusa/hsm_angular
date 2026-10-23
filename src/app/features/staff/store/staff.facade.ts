import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { StaffActions } from './staff.actions';
import {
  selectStaffMembers,
  selectShifts,
  selectStaffLoading,
  selectStaffSaving,
  selectStaffError,
  selectConflictCount,
  selectTodayShiftCount,
} from './staff.selectors';
import { ShiftType, StaffSearchCriteria } from '../domain/staff.entity';

@Injectable({ providedIn: 'root' })
export class StaffFacade {
  private readonly store = inject(Store);

  readonly staff = this.store.selectSignal(selectStaffMembers);
  readonly shifts = this.store.selectSignal(selectShifts);
  readonly loading = this.store.selectSignal(selectStaffLoading);
  readonly saving = this.store.selectSignal(selectStaffSaving);
  readonly error = this.store.selectSignal(selectStaffError);
  readonly conflictCount = this.store.selectSignal(selectConflictCount);
  readonly todayCount = this.store.selectSignal(selectTodayShiftCount);

  load(criteria?: StaffSearchCriteria): void {
    this.store.dispatch(StaffActions.load({ criteria }));
  }

  createShift(payload: {
    staffId: string;
    date: string;
    shiftType: ShiftType;
    location?: string;
    notes?: string;
  }): void {
    this.store.dispatch(StaffActions.createShift(payload));
  }

  confirm(id: string): void {
    this.store.dispatch(StaffActions.confirmShift({ id }));
  }

  cancel(id: string): void {
    this.store.dispatch(StaffActions.cancelShift({ id }));
  }
}
