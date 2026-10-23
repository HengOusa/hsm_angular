import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, exhaustMap, tap } from 'rxjs/operators';
import { PharmacyActions } from './pharmacy.actions';
import { PharmacyMockRepository } from '../data/pharmacy-mock.repository';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable()
export class PharmacyEffects {
  private readonly actions$ = inject(Actions);
  private readonly repo = inject(PharmacyMockRepository);
  private readonly notify = inject(NotificationService);

  loadInventory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PharmacyActions.loadInventory),
      switchMap(({ query, lowStockOnly }) =>
        this.repo.listDrugs(query, lowStockOnly).pipe(
          map((drugs) => PharmacyActions.loadInventorySuccess({ drugs })),
          catchError((e) =>
            of(PharmacyActions.loadInventoryFailure({ error: e?.message ?? 'Failed' }))
          )
        )
      )
    )
  );

  loadRx$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PharmacyActions.loadPrescriptions),
      switchMap(({ status }) =>
        this.repo.listPrescriptions(status).pipe(
          map((prescriptions) =>
            PharmacyActions.loadPrescriptionsSuccess({ prescriptions })
          ),
          catchError((e) =>
            of(PharmacyActions.loadPrescriptionsFailure({ error: e?.message ?? 'Failed' }))
          )
        )
      )
    )
  );

  dispense$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PharmacyActions.dispense),
      exhaustMap(({ id, dispensedBy }) => {
        try {
          return this.repo.dispense(id, dispensedBy).pipe(
            map((prescription) => PharmacyActions.dispenseSuccess({ prescription })),
            catchError((e) =>
              of(PharmacyActions.dispenseFailure({ error: e?.message ?? 'Dispense failed' }))
            )
          );
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Dispense failed';
          return of(PharmacyActions.dispenseFailure({ error: msg }));
        }
      })
    )
  );

  dispenseOk$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PharmacyActions.dispenseSuccess),
        tap(({ prescription }) => {
          this.notify.success(`Dispensed ${prescription.prescriptionNumber}`);
        })
      ),
    { dispatch: false }
  );

  // Refresh inventory after dispense
  dispenseRefresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PharmacyActions.dispenseSuccess),
      map(() => PharmacyActions.loadInventory({}))
    )
  );

  dispenseFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PharmacyActions.dispenseFailure),
        tap(({ error }) => this.notify.error(error))
      ),
    { dispatch: false }
  );

  cancel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PharmacyActions.cancelRx),
      exhaustMap(({ id }) =>
        this.repo.cancel(id).pipe(
          map((prescription) => PharmacyActions.cancelRxSuccess({ prescription })),
          catchError((e) =>
            of(PharmacyActions.cancelRxFailure({ error: e?.message ?? 'Cancel failed' }))
          )
        )
      )
    )
  );
}
