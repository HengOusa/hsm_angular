import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, forkJoin } from 'rxjs';
import { map, catchError, switchMap, exhaustMap, tap } from 'rxjs/operators';
import { StaffActions } from './staff.actions';
import { StaffMockRepository } from '../data/staff-mock.repository';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable()
export class StaffEffects {
  private readonly actions$ = inject(Actions);
  private readonly repo = inject(StaffMockRepository);
  private readonly notify = inject(NotificationService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StaffActions.load),
      switchMap(({ criteria }) =>
        forkJoin({
          staff: this.repo.listStaff(),
          shifts: this.repo.listShifts(criteria ?? {}),
        }).pipe(
          map(({ staff, shifts }) => StaffActions.loadSuccess({ staff, shifts })),
          catchError((e) =>
            of(StaffActions.loadFailure({ error: e?.message ?? 'Failed' }))
          )
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StaffActions.createShift),
      exhaustMap((action) => {
        try {
          return this.repo
            .createShift({
              staffId: action.staffId,
              date: action.date,
              shiftType: action.shiftType,
              location: action.location,
              notes: action.notes,
            })
            .pipe(
              map((shift) => StaffActions.createShiftSuccess({ shift })),
              catchError((e) =>
                of(StaffActions.createShiftFailure({ error: e?.message ?? 'Create failed' }))
              )
            );
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Create failed';
          return of(StaffActions.createShiftFailure({ error: msg }));
        }
      })
    )
  );

  createOk$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(StaffActions.createShiftSuccess),
        tap(({ shift }) => {
          if (shift.conflictIds.length) {
            this.notify.warning(
              `Shift scheduled with CONFLICT · ${shift.staffName} · ${shift.date}`
            );
          } else {
            this.notify.success(`Shift scheduled · ${shift.staffName} · ${shift.shiftType}`);
          }
        })
      ),
    { dispatch: false }
  );

  // Reload to refresh conflict flags on all shifts
  createRefresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StaffActions.createShiftSuccess, StaffActions.cancelShiftSuccess),
      map(() => StaffActions.load({}))
    )
  );

  confirm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StaffActions.confirmShift),
      exhaustMap(({ id }) =>
        this.repo.confirmShift(id).pipe(
          map((shift) => StaffActions.confirmShiftSuccess({ shift })),
          catchError((e) =>
            of(StaffActions.confirmShiftFailure({ error: e?.message ?? 'Confirm failed' }))
          )
        )
      )
    )
  );

  cancel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StaffActions.cancelShift),
      exhaustMap(({ id }) =>
        this.repo.cancelShift(id).pipe(
          map((shift) => StaffActions.cancelShiftSuccess({ shift })),
          catchError((e) =>
            of(StaffActions.cancelShiftFailure({ error: e?.message ?? 'Cancel failed' }))
          )
        )
      )
    )
  );
}
