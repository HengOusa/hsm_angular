import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, forkJoin } from 'rxjs';
import { map, catchError, switchMap, exhaustMap, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { BedActions } from './bed.actions';
import { BedMockRepository } from '../data/bed-mock.repository';
import { NotificationService } from '../../../core/services/notification.service';
import { selectBedsState } from './bed.selectors';

@Injectable()
export class BedEffects {
  private readonly actions$ = inject(Actions);
  private readonly repo = inject(BedMockRepository);
  private readonly notify = inject(NotificationService);
  private readonly store = inject(Store);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BedActions.load, BedActions.setWardFilter, BedActions.setStatusFilter),
      withLatestFrom(this.store.select(selectBedsState)),
      switchMap(([, state]) =>
        forkJoin({
          beds: this.repo.search({
            wardId: state.wardFilter,
            status: state.statusFilter,
          }),
          wards: this.repo.getWards(),
        }).pipe(
          map(({ beds, wards }) => BedActions.loadSuccess({ beds, wards })),
          catchError((err) =>
            of(BedActions.loadFailure({ error: err?.message ?? 'Failed to load beds' }))
          )
        )
      )
    )
  );

  updateStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BedActions.updateStatus),
      exhaustMap(({ id, status, patient }) =>
        this.repo.updateStatus(id, status, patient).pipe(
          map((bed) => BedActions.updateStatusSuccess({ bed })),
          catchError((err) =>
            of(BedActions.updateStatusFailure({ error: err?.message ?? 'Update failed' }))
          )
        )
      )
    )
  );

  updateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BedActions.updateStatusSuccess),
        tap(({ bed }) => this.notify.success(`${bed.bedNumber} → ${bed.status}`))
      ),
    { dispatch: false }
  );
}
