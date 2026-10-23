import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { initialAuthState } from './auth.state';

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { response }) => {
    const expiresAt = new Date(Date.now() + response.expiresIn * 1000).toISOString();
    return {
      ...state,
      user: response.user,
      accessToken: response.accessToken,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      tokenExpiresAt: expiresAt,
      sessionWarningSeconds: null,
    };
  }),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
    isAuthenticated: false,
    user: null,
    accessToken: null,
  })),

  on(AuthActions.logout, AuthActions.logoutSuccess, AuthActions.sessionExpired, () => ({
    ...initialAuthState,
  })),

  on(AuthActions.refreshTokenSuccess, (state, { accessToken, expiresIn }) => ({
    ...state,
    accessToken,
    tokenExpiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    sessionWarningSeconds: null,
  })),

  on(AuthActions.refreshTokenFailure, () => ({
    ...initialAuthState,
  })),

  on(AuthActions.hydrateSuccess, (state, { user, accessToken }) => ({
    ...state,
    user,
    accessToken,
    isAuthenticated: true,
  })),

  on(AuthActions.hydrateFailure, () => ({
    ...initialAuthState,
  })),

  on(AuthActions.sessionWarning, (state, { remainingSeconds }) => ({
    ...state,
    sessionWarningSeconds: remainingSeconds,
  })),

  on(AuthActions.sessionExtend, (state) => ({
    ...state,
    sessionWarningSeconds: null,
  })),

  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null,
  })),

  on(AuthActions.setUser, (state, { user }) => ({
    ...state,
    user,
  }))
);
