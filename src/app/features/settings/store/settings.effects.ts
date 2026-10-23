import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, exhaustMap, tap } from 'rxjs/operators';
import { SettingsActions } from './settings.actions';
import { SettingsRepository } from '../data/settings.repository';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable()
export class SettingsEffects {
  private readonly actions$ = inject(Actions);
  private readonly repo = inject(SettingsRepository);
  private readonly notify = inject(NotificationService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.load),
      switchMap(() =>
        this.repo.load().pipe(
          map((preferences) => SettingsActions.loadSuccess({ preferences })),
          catchError((e) => of(SettingsActions.failure({ error: e?.message ?? 'Load failed' })))
        )
      )
    )
  );

  save$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.save),
      exhaustMap(({ preferences }) =>
        this.repo.save(preferences).pipe(
          map((p) => SettingsActions.saveSuccess({ preferences: p })),
          catchError((e) => of(SettingsActions.failure({ error: e?.message ?? 'Save failed' })))
        )
      )
    )
  );

  saveOk$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SettingsActions.saveSuccess),
        tap(() => this.notify.success('Preferences saved'))
      ),
    { dispatch: false }
  );

  reset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.reset),
      exhaustMap(() =>
        this.repo.reset().pipe(
          map((preferences) => SettingsActions.resetSuccess({ preferences })),
          catchError((e) => of(SettingsActions.failure({ error: e?.message ?? 'Reset failed' })))
        )
      )
    )
  );

  resetOk$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SettingsActions.resetSuccess),
        tap(() => this.notify.info('Preferences reset to defaults'))
      ),
    { dispatch: false }
  );
}
