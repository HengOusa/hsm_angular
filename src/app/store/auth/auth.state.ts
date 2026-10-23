import { AuthUser } from '../../core/auth/auth.service';

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  /** Seconds until session warning (null = no active warning) */
  sessionWarningSeconds: number | null;
  /** ISO timestamp when access token expires */
  tokenExpiresAt: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  sessionWarningSeconds: null,
  tokenExpiresAt: null,
};
