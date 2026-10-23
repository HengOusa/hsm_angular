import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthUser = createSelector(selectAuthState, (s) => s.user);
export const selectAccessToken = createSelector(selectAuthState, (s) => s.accessToken);
export const selectIsAuthenticated = createSelector(selectAuthState, (s) => s.isAuthenticated);
export const selectAuthLoading = createSelector(selectAuthState, (s) => s.isLoading);
export const selectAuthError = createSelector(selectAuthState, (s) => s.error);
export const selectUserRole = createSelector(selectAuthUser, (u) => u?.role ?? null);
export const selectUserPermissions = createSelector(selectAuthUser, (u) => u?.permissions ?? []);
export const selectFullName = createSelector(selectAuthUser, (u) =>
  u ? `${u.firstName} ${u.lastName}` : ''
);
export const selectSessionWarningSeconds = createSelector(
  selectAuthState,
  (s) => s.sessionWarningSeconds
);
export const selectTokenExpiresAt = createSelector(selectAuthState, (s) => s.tokenExpiresAt);
export const selectShowSessionWarning = createSelector(
  selectSessionWarningSeconds,
  (sec) => sec !== null && sec > 0
);
