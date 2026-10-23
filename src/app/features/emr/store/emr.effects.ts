import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, exhaustMap, tap, debounceTime } from 'rxjs/operators';
import { EmrActions } from './emr.actions';
import { EmrMockRepository } from '../data/emr-mock.repository';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable()
export class EmrEffects {
  private readonly actions$ = inject(Actions);
  private readonly repo = inject(EmrMockRepository);
  private readonly notify = inject(NotificationService);

  loadNotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmrActions.loadNotes),
      switchMap(({ patientId }) =>
        this.repo.listNotes(patientId).pipe(
          map((notes) => EmrActions.loadNotesSuccess({ notes })),
          catchError((e) => of(EmrActions.loadNotesFailure({ error: e?.message ?? 'Failed' })))
        )
      )
    )
  );

  saveNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmrActions.saveNote),
      exhaustMap(({ note }) =>
        this.repo.saveNote(note).pipe(
          map((saved) => EmrActions.saveNoteSuccess({ note: saved })),
          catchError((e) => of(EmrActions.saveNoteFailure({ error: e?.message ?? 'Save failed' })))
        )
      )
    )
  );

  saveNoteOk$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmrActions.saveNoteSuccess),
        tap(() => this.notify.success('SOAP note saved'))
      ),
    { dispatch: false }
  );

  loadVitals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmrActions.loadVitals),
      switchMap(({ patientId }) =>
        this.repo.listVitals(patientId).pipe(
          map((vitals) => EmrActions.loadVitalsSuccess({ vitals })),
          catchError((e) => of(EmrActions.loadVitalsFailure({ error: e?.message ?? 'Failed' })))
        )
      )
    )
  );

  saveVitals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmrActions.saveVitals),
      exhaustMap(({ vitals }) =>
        this.repo.saveVitals(vitals).pipe(
          map((saved) => EmrActions.saveVitalsSuccess({ vitals: saved })),
          catchError((e) => of(EmrActions.saveVitalsFailure({ error: e?.message ?? 'Save failed' })))
        )
      )
    )
  );

  saveVitalsOk$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmrActions.saveVitalsSuccess),
        tap(({ vitals }) => {
          if (vitals.isAbnormal) {
            this.notify.warning(`Vitals saved · abnormal: ${vitals.abnormalFlags.join(', ')}`);
          } else {
            this.notify.success('Vitals recorded');
          }
        })
      ),
    { dispatch: false }
  );

  searchIcd$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmrActions.searchIcd),
      debounceTime(200),
      switchMap(({ query }) =>
        this.repo.searchIcd10(query).pipe(
          map((results) => EmrActions.searchIcdSuccess({ results }))
        )
      )
    )
  );
}
