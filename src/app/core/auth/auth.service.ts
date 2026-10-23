import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from './token-storage.service';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'HOSPITAL_ADMIN'
  | 'DOCTOR'
  | 'NURSE'
  | 'RECEPTIONIST'
  | 'PHARMACIST'
  | 'LAB_TECHNICIAN'
  | 'PATIENT';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: string[];
  departmentId?: string;
  photoUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  expiresIn: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);

  private readonly currentUserSignal = signal<AuthUser | null>(null);
  private readonly isLoadingSignal = signal(false);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal() && !!this.tokenStorage.getAccessToken());
  readonly userRole = computed(() => this.currentUserSignal()?.role ?? null);
  readonly fullName = computed(() => {
    const u = this.currentUserSignal();
    return u ? `${u.firstName} ${u.lastName}` : '';
  });

  constructor() {
    this.hydrateFromStorage();
  }

  login(credentials: LoginRequest): Observable<LoginResponse | null> {
    this.isLoadingSignal.set(true);
    // Mock for starter – replace with real API
    return of(this.mockLogin(credentials)).pipe(
      tap((res) => {
        if (res) {
          this.tokenStorage.setTokens(res.accessToken, res.refreshToken);
          this.currentUserSignal.set(res.user);
        }
        this.isLoadingSignal.set(false);
      }),
      catchError(() => {
        this.isLoadingSignal.set(false);
        return of(null);
      })
    );
  }

  logout(): void {
    this.tokenStorage.clear();
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSignal();
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserSignal();
    return !!user?.permissions.includes(permission) || user?.role === 'SUPER_ADMIN';
  }

  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every((p) => this.hasPermission(p));
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((p) => this.hasPermission(p));
  }

  hasRole(role: UserRole | UserRole[]): boolean {
    const userRole = this.userRole();
    if (!userRole) return false;
    return Array.isArray(role) ? role.includes(userRole) : userRole === role;
  }

  private hydrateFromStorage(): void {
    const token = this.tokenStorage.getAccessToken();
    const storedUser = this.tokenStorage.getUser();
    if (token && storedUser) {
      this.currentUserSignal.set(storedUser);
    }
  }

  /** Demo mock – replace with real backend call */
  private mockLogin(credentials: LoginRequest): LoginResponse {
    const role = credentials.role ?? 'DOCTOR';
    const user: AuthUser = {
      id: 'usr-001',
      email: credentials.email,
      firstName: 'Sarah',
      lastName: 'Chen',
      role,
      permissions: this.getPermissionsForRole(role),
      photoUrl: undefined,
    };
    return {
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token',
      user,
      expiresIn: 900,
    };
  }

  private getPermissionsForRole(role: UserRole): string[] {
    const map: Record<UserRole, string[]> = {
      SUPER_ADMIN: ['*'],
      HOSPITAL_ADMIN: ['patients:read', 'patients:write', 'staff:read', 'staff:write', 'billing:read', 'billing:write', 'reports:read'],
      DOCTOR: ['patients:read', 'patients:write', 'appointments:read', 'appointments:write', 'emr:write', 'lab:order', 'prescriptions:write'],
      NURSE: ['patients:read', 'patients:write', 'vitals:write', 'medications:admin', 'nursing:write'],
      RECEPTIONIST: ['patients:read', 'patients:write', 'appointments:read', 'appointments:write', 'billing:read'],
      PHARMACIST: ['prescriptions:read', 'prescriptions:dispense', 'inventory:read', 'inventory:write'],
      LAB_TECHNICIAN: ['lab:read', 'lab:write', 'lab:report'],
      PATIENT: ['own:read', 'own:appointments'],
    };
    return map[role] ?? [];
  }
}
