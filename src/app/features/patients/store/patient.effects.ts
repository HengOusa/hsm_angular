import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap, exhaustMap } from 'rxjs/operators';
import { PatientActions } from './patient.actions';
import { PatientMockRepository } from '../data/patient-mock.repository';
import { NotificationService } from '../../../core/services/notification.service';
import { AuditService } from '../../../core/services/audit.service';

@Injectable()
export class PatientEffects {
  private readonly actions$ = inject(Actions);
  private readonly repo = inject(PatientMockRepository);
  private readonly notify = inject(NotificationService);
  private readonly audit = inject(AuditService);
  private readonly router = inject(Router);

  search$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientActions.search),
      switchMap(({ criteria }) =>
        this.repo.search(criteria).pipe(
          map((result) => PatientActions.searchSuccess({ result })),
          catchError((err) =>
            of(PatientActions.searchFailure({ error: err?.message ?? 'Search failed' }))
          )
        )
      )
    )
  );

  loadOne$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientActions.loadOne),
      switchMap(({ id }) =>
        this.repo.getById(id).pipe(
          map((patient) => {
            if (!patient) {
              return PatientActions.loadOneFailure({ error: 'Patient not found' });
            }
            this.audit.logAccess('patient', id);
            return PatientActions.loadOneSuccess({ patient });
          }),
          catchError((err) =>
            of(PatientActions.loadOneFailure({ error: err?.message ?? 'Load failed' }))
          )
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientActions.create),
      exhaustMap(({ patient }) =>
        this.repo.create(patient).pipe(
          map((created) => {
            this.audit.logCreate('patient', created.id, { mrn: created.mrn });
            return PatientActions.createSuccess({ patient: created });
          }),
          catchError((err) =>
            of(PatientActions.createFailure({ error: err?.message ?? 'Create failed' }))
          )
        )
      )
    )
  );

  createSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PatientActions.createSuccess),
        tap(({ patient }) => {
          this.notify.success(`Patient registered · ${patient.mrn}`);
          this.router.navigate(['/patients', patient.id]);
        })
      ),
    { dispatch: false }
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientActions.update),
      exhaustMap(({ id, patch }) =>
        this.repo.update(id, patch).pipe(
          map((patient) => {
            this.audit.logUpdate('patient', id);
            return PatientActions.updateSuccess({ patient });
          }),
          catchError((err) =>
            of(PatientActions.updateFailure({ error: err?.message ?? 'Update failed' }))
          )
        )
      )
    )
  );

  updateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PatientActions.updateSuccess),
        tap(() => this.notify.success('Patient updated'))
      ),
    { dispatch: false }
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientActions.delete),
      exhaustMap(({ id }) =>
        this.repo.delete(id).pipe(
          map(() => {
            this.audit.logDelete('patient', id);
            return PatientActions.deleteSuccess({ id });
          }),
          catchError((err) =>
            of(PatientActions.deleteFailure({ error: err?.message ?? 'Delete failed' }))
          )
        )
      )
    )
  );
}
