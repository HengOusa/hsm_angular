import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import {
  selectAuthUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectFullName,
  selectUserRole,
  selectUserPermissions,
  selectSessionWarningSeconds,
  selectShowSessionWarning,
  selectAccessToken,
} from './auth.selectors';
import { LoginRequest, UserRole } from '../../core/auth/auth.service';

/**
 * Simplified API for components – prefer this over raw Store dispatch/select.
 */
@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly store = inject(Store);

  readonly user$ = this.store.select(selectAuthUser);
  readonly isAuthenticated$ = this.store.select(selectIsAuthenticated);
  readonly isLoading$ = this.store.select(selectAuthLoading);
  readonly error$ = this.store.select(selectAuthError);
  readonly fullName$ = this.store.select(selectFullName);
  readonly role$ = this.store.select(selectUserRole);
  readonly permissions$ = this.store.select(selectUserPermissions);
  readonly sessionWarningSeconds$ = this.store.select(selectSessionWarningSeconds);
  readonly showSessionWarning$ = this.store.select(selectShowSessionWarning);
  readonly accessToken$ = this.store.select(selectAccessToken);

  // Signal-friendly one-shots via store.selectSignal (Angular 16+)
  readonly user = this.store.selectSignal(selectAuthUser);
  readonly isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  readonly isLoading = this.store.selectSignal(selectAuthLoading);
  readonly error = this.store.selectSignal(selectAuthError);
  readonly fullName = this.store.selectSignal(selectFullName);
  readonly role = this.store.selectSignal(selectUserRole);
  readonly showSessionWarning = this.store.selectSignal(selectShowSessionWarning);
  readonly sessionWarningSeconds = this.store.selectSignal(selectSessionWarningSeconds);

  login(credentials: LoginRequest): void {
    this.store.dispatch(AuthActions.login({ credentials }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  hydrate(): void {
    this.store.dispatch(AuthActions.hydrate());
  }

  clearError(): void {
    this.store.dispatch(AuthActions.clearError());
  }

  extendSession(): void {
    this.store.dispatch(AuthActions.sessionExtend());
  }

  sessionExpired(): void {
    this.store.dispatch(AuthActions.sessionExpired());
  }

  warnSession(remainingSeconds: number): void {
    this.store.dispatch(AuthActions.sessionWarning({ remainingSeconds }));
  }

  hasPermission(permission: string): boolean {
    const user = this.user();
    if (!user) return false;
    return user.permissions.includes('*') || user.permissions.includes(permission);
  }

  hasRole(role: UserRole | UserRole[]): boolean {
    const current = this.role();
    if (!current) return false;
    return Array.isArray(role) ? role.includes(current) : current === role;
  }
}
