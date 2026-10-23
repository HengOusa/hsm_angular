import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap, exhaustMap } from 'rxjs/operators';
import { AuthActions } from './auth.actions';
import { AuthService } from '../../core/auth/auth.service';
import { TokenStorageService } from '../../core/auth/token-storage.service';
import { NotificationService } from '../../core/services/notification.service';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly auth = inject(AuthService);
  private readonly tokens = inject(TokenStorageService);
  private readonly router = inject(Router);
  private readonly notify = inject(NotificationService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ credentials }) =>
        this.auth.login(credentials).pipe(
          map((response) => {
            if (!response) {
              return AuthActions.loginFailure({ error: 'Invalid email or password.' });
            }
            this.tokens.setTokens(response.accessToken, response.refreshToken);
            this.tokens.setUser(response.user);
            return AuthActions.loginSuccess({ response });
          }),
          catchError((err) =>
            of(
              AuthActions.loginFailure({
                error: err?.message ?? 'Login failed. Please try again.',
              })
            )
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.notify.success('Signed in successfully');
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout, AuthActions.sessionExpired),
      tap(() => {
        this.tokens.clear();
        this.router.navigate(['/auth/login']);
      }),
      map(() => AuthActions.logoutSuccess())
    )
  );

  sessionExpiredNotify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.sessionExpired),
        tap(() => this.notify.warning('Your session has expired. Please sign in again.'))
      ),
    { dispatch: false }
  );

  hydrate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.hydrate),
      map(() => {
        const token = this.tokens.getAccessToken();
        const user = this.tokens.getUser();
        if (token && user) {
          return AuthActions.hydrateSuccess({ user, accessToken: token });
        }
        return AuthActions.hydrateFailure();
      })
    )
  );

  /** Demo refresh – replace with real API call */
  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken, AuthActions.sessionExtend),
      switchMap(() => {
        const refresh = this.tokens.getRefreshToken();
        if (!refresh) {
          return of(AuthActions.refreshTokenFailure());
        }
        // Mock: issue new access token
        const accessToken = 'mock-access-token-' + Date.now();
        const expiresIn = 900;
        this.tokens.setTokens(accessToken, refresh);
        this.notify.info('Session extended');
        return of(AuthActions.refreshTokenSuccess({ accessToken, expiresIn }));
      })
    )
  );
}
