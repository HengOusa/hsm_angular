import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AuditActions } from './audit.actions';
import { AuditMockRepository } from '../data/audit-mock.repository';

@Injectable()
export class AuditEffects {
  private readonly actions$ = inject(Actions);
  private readonly repo = inject(AuditMockRepository);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuditActions.load),
      switchMap(({ action, query }) =>
        this.repo.list(action, query).pipe(
          map((entries) => AuditActions.loadSuccess({ entries })),
          catchError((e) => of(AuditActions.loadFailure({ error: e?.message ?? 'Failed' })))
        )
      )
    )
  );
}
