import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, switchMap, exhaustMap, tap, withLatestFrom } from 'rxjs/operators';
import { EmergencyActions } from './emergency.actions';
import { EmergencyMockRepository } from '../data/emergency-mock.repository';
import { NotificationService } from '../../../core/services/notification.service';
import { selectEmergencyState } from './emergency.selectors';

@Injectable()
export class EmergencyEffects {
  private readonly actions$ = inject(Actions);
  private readonly repo = inject(EmergencyMockRepository);
  private readonly notify = inject(NotificationService);
  private readonly store = inject(Store);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        EmergencyActions.load,
        EmergencyActions.setStatusFilter,
        EmergencyActions.setTriageFilter
      ),
      withLatestFrom(this.store.select(selectEmergencyState)),
      switchMap(([, state]) =>
        this.repo
          .list({
            status: state.statusFilter,
            triageLevel: state.triageFilter,
          })
          .pipe(
            map((cases) => EmergencyActions.loadSuccess({ cases })),
            catchError((e) =>
              of(EmergencyActions.loadFailure({ error: e?.message ?? 'Failed' }))
            )
          )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmergencyActions.create),
      exhaustMap(({ case: c }) =>
        this.repo.create(c).pipe(
          map((created) => EmergencyActions.createSuccess({ case: created })),
          catchError((e) =>
            of(EmergencyActions.createFailure({ error: e?.message ?? 'Create failed' }))
          )
        )
      )
    )
  );

  createOk$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmergencyActions.createSuccess),
        tap(({ case: c }) =>
          this.notify.success(`ER case ${c.caseNumber} · ${c.triageLevel}`)
        )
      ),
    { dispatch: false }
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmergencyActions.update),
      exhaustMap(({ id, patch }) =>
        this.repo.update(id, patch).pipe(
          map((updated) => EmergencyActions.updateSuccess({ case: updated })),
          catchError((e) =>
            of(EmergencyActions.updateFailure({ error: e?.message ?? 'Update failed' }))
          )
        )
      )
    )
  );

  trauma$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmergencyActions.activateTrauma),
      exhaustMap(({ id }) =>
        this.repo.activateTraumaTeam(id).pipe(
          map((c) => EmergencyActions.activateTraumaSuccess({ case: c })),
          catchError((e) =>
            of(
              EmergencyActions.activateTraumaFailure({
                error: e?.message ?? 'Activation failed',
              })
            )
          )
        )
      )
    )
  );

  traumaOk$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmergencyActions.activateTraumaSuccess),
        tap(({ case: c }) =>
          this.notify.error(`TRAUMA TEAM · ${c.caseNumber} · ${c.patientName} → Resus`)
        )
      ),
    { dispatch: false }
  );
}
