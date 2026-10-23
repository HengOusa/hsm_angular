import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap, exhaustMap } from 'rxjs/operators';
import { AppointmentActions } from './appointment.actions';
import { AppointmentMockRepository } from '../data/appointment-mock.repository';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable()
export class AppointmentEffects {
  private readonly actions$ = inject(Actions);
  private readonly repo = inject(AppointmentMockRepository);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);

  search$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.search),
      switchMap(({ criteria }) =>
        this.repo.search(criteria).pipe(
          map((result) => AppointmentActions.searchSuccess({ result })),
          catchError((err) =>
            of(AppointmentActions.searchFailure({ error: err?.message ?? 'Search failed' }))
          )
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.create),
      exhaustMap(({ appointment }) => {
        try {
          return this.repo.create(appointment).pipe(
            map((created) => AppointmentActions.createSuccess({ appointment: created })),
            catchError((err) =>
              of(
                AppointmentActions.createFailure({
                  error: err?.message ?? 'Could not book appointment',
                })
              )
            )
          );
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Could not book appointment';
          return of(AppointmentActions.createFailure({ error: message }));
        }
      })
    )
  );

  createSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppointmentActions.createSuccess),
        tap(({ appointment }) => {
          this.notify.success(`Booked ${appointment.appointmentNumber}`);
          this.router.navigate(['/appointments']);
        })
      ),
    { dispatch: false }
  );

  createFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppointmentActions.createFailure),
        tap(({ error }) => this.notify.error(error))
      ),
    { dispatch: false }
  );

  updateStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.updateStatus),
      exhaustMap(({ id, status }) =>
        this.repo.updateStatus(id, status).pipe(
          map((appointment) => AppointmentActions.updateStatusSuccess({ appointment })),
          catchError((err) =>
            of(
              AppointmentActions.updateStatusFailure({
                error: err?.message ?? 'Status update failed',
              })
            )
          )
        )
      )
    )
  );

  loadSlots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.loadSlots),
      switchMap(({ doctorId, date }) =>
        this.repo.getSlots(doctorId, date).pipe(
          map((slots) => AppointmentActions.loadSlotsSuccess({ slots })),
          catchError((err) =>
            of(AppointmentActions.loadSlotsFailure({ error: err?.message ?? 'Slots failed' }))
          )
        )
      )
    )
  );
}
