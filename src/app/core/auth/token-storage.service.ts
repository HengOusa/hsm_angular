import { Injectable } from '@angular/core';
import { AuthUser } from './auth.service';

const ACCESS_KEY = 'mc_access_token';
const REFRESH_KEY = 'mc_refresh_token';
const USER_KEY = 'mc_user';

/**
 * Session-only storage for tokens and user.
 * Never persist PHI in localStorage for HIPAA awareness.
 */
@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  setTokens(access: string, refresh: string): void {
    sessionStorage.setItem(ACCESS_KEY, access);
    sessionStorage.setItem(REFRESH_KEY, refresh);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(REFRESH_KEY);
  }

  setUser(user: AuthUser): void {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): AuthUser | null {
    const raw = sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  clear(): void {
    sessionStorage.removeItem(ACCESS_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
    sessionStorage.removeItem(USER_KEY);
  }
}
