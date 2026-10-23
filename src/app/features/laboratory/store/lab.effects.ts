import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, forkJoin } from 'rxjs';
import { map, catchError, switchMap, exhaustMap, tap, mergeMap } from 'rxjs/operators';
import { LabActions } from './lab.actions';
import { LabMockRepository } from '../data/lab-mock.repository';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable()
export class LabEffects {
  private readonly actions$ = inject(Actions);
  private readonly repo = inject(LabMockRepository);
  private readonly notify = inject(NotificationService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabActions.load),
      switchMap(({ criteria }) =>
        forkJoin({
          tests: this.repo.list(criteria ?? {}),
          catalog: this.repo.catalog(),
        }).pipe(
          mergeMap(({ tests, catalog }) => [
            LabActions.loadSuccess({ tests }),
            LabActions.loadCatalogSuccess({ catalog }),
          ]),
          catchError((e) => of(LabActions.loadFailure({ error: e?.message ?? 'Failed' })))
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabActions.createOrder),
      exhaustMap((action) =>
        this.repo
          .createOrder({
            patientId: action.patientId,
            patientName: action.patientName,
            orderedBy: action.orderedBy,
            orderedByName: action.orderedByName,
            testCodes: action.testCodes,
          })
          .pipe(
            map((tests) => LabActions.createOrderSuccess({ tests })),
            catchError((e) =>
              of(LabActions.createOrderFailure({ error: e?.message ?? 'Order failed' }))
            )
          )
      )
    )
  );

  createOk$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LabActions.createOrderSuccess),
        tap(({ tests }) =>
          this.notify.success(`Ordered ${tests.length} test(s) · ${tests[0]?.orderId ?? ''}`)
        )
      ),
    { dispatch: false }
  );

  status$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabActions.updateStatus),
      exhaustMap(({ id, status }) =>
        this.repo.updateStatus(id, status).pipe(
          map((test) => LabActions.updateStatusSuccess({ test })),
          catchError((e) =>
            of(LabActions.updateStatusFailure({ error: e?.message ?? 'Update failed' }))
          )
        )
      )
    )
  );

  result$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabActions.enterResult),
      exhaustMap(({ id, result, numericResult, reportedBy, notes }) =>
        this.repo.enterResult(id, { result, numericResult, reportedBy, notes }).pipe(
          map((test) => LabActions.enterResultSuccess({ test })),
          catchError((e) =>
            of(LabActions.enterResultFailure({ error: e?.message ?? 'Result failed' }))
          )
        )
      )
    )
  );

  resultOk$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LabActions.enterResultSuccess),
        tap(({ test }) => {
          if (test.isCritical) {
            this.notify.error(
              `CRITICAL: ${test.testName} = ${test.result} ${test.unit ?? ''} · ${test.patientName} · notify ${test.orderedByName}`
            );
          } else if (test.isAbnormal) {
            this.notify.warning(`Abnormal ${test.testName}: ${test.result} ${test.unit ?? ''}`);
          } else {
            this.notify.success(`Result reported: ${test.testName}`);
          }
        })
      ),
    { dispatch: false }
  );
}
