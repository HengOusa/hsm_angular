import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, exhaustMap } from 'rxjs/operators';
import { NotificationActions } from './notification.actions';
import { NotificationMockRepository } from '../data/notification-mock.repository';

@Injectable()
export class NotificationEffects {
  private readonly actions$ = inject(Actions);
  private readonly repo = inject(NotificationMockRepository);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.load),
      switchMap(() =>
        this.repo.list().pipe(
          map((items) => NotificationActions.loadSuccess({ items })),
          catchError((e) =>
            of(NotificationActions.loadFailure({ error: e?.message ?? 'Failed' }))
          )
        )
      )
    )
  );

  markRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.markRead),
      exhaustMap(({ id }) =>
        this.repo.markRead(id).pipe(
          map((item) => NotificationActions.markReadSuccess({ item })),
          catchError(() => of(NotificationActions.loadFailure({ error: 'Mark read failed' })))
        )
      )
    )
  );

  markAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.markAllRead),
      exhaustMap(() =>
        this.repo.markAllRead().pipe(
          map((items) => NotificationActions.markAllReadSuccess({ items }))
        )
      )
    )
  );
}
