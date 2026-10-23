import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuthUser, LoginRequest, LoginResponse, UserRole } from '../../core/auth/auth.service';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    // Login
    'Login': props<{ credentials: LoginRequest }>(),
    'Login Success': props<{ response: LoginResponse }>(),
    'Login Failure': props<{ error: string }>(),

    // Logout
    'Logout': emptyProps(),
    'Logout Success': emptyProps(),

    // Token refresh
    'Refresh Token': emptyProps(),
    'Refresh Token Success': props<{ accessToken: string; expiresIn: number }>(),
    'Refresh Token Failure': emptyProps(),

    // Hydrate from session storage on app start
    'Hydrate': emptyProps(),
    'Hydrate Success': props<{ user: AuthUser; accessToken: string }>(),
    'Hydrate Failure': emptyProps(),

    // Session timeout
    'Session Warning': props<{ remainingSeconds: number }>(),
    'Session Extend': emptyProps(),
    'Session Expired': emptyProps(),

    // Clear error
    'Clear Error': emptyProps(),

    // Update user profile locally
    'Set User': props<{ user: AuthUser }>(),
  },
});
