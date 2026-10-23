import { AuthState } from './auth/auth.state';
import { UiState } from './ui/ui.state';

/**
 * Root application state.
 * Feature stores (patients, appointments, …) are registered lazily per module.
 */
export interface AppState {
  auth: AuthState;
  ui: UiState;
}
