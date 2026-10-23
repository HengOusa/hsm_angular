import { createReducer, on } from '@ngrx/store';
import { DEFAULT_PREFERENCES, UserPreferences } from '../domain/settings.entity';
import { SettingsActions } from './settings.actions';

export interface SettingsState {
  preferences: UserPreferences;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialSettingsState: SettingsState = {
  preferences: { ...DEFAULT_PREFERENCES },
  loading: false,
  saving: false,
  error: null,
};

export const settingsReducer = createReducer(
  initialSettingsState,
  on(SettingsActions.load, (s) => ({ ...s, loading: true, error: null })),
  on(SettingsActions.loadSuccess, (s, { preferences }) => ({
    ...s,
    preferences,
    loading: false,
  })),
  on(SettingsActions.save, (s) => ({ ...s, saving: true, error: null })),
  on(SettingsActions.saveSuccess, SettingsActions.resetSuccess, (s, { preferences }) => ({
    ...s,
    preferences,
    saving: false,
    loading: false,
  })),
  on(SettingsActions.reset, (s) => ({ ...s, saving: true })),
  on(SettingsActions.failure, (s, { error }) => ({
    ...s,
    loading: false,
    saving: false,
    error,
  }))
);
