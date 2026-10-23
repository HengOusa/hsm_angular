import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SettingsState } from './settings.reducer';

export const selectSettingsState = createFeatureSelector<SettingsState>('settings');
export const selectPreferences = createSelector(selectSettingsState, (s) => s.preferences);
export const selectSettingsLoading = createSelector(selectSettingsState, (s) => s.loading);
export const selectSettingsSaving = createSelector(selectSettingsState, (s) => s.saving);
