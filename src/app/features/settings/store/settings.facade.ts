import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { SettingsActions } from './settings.actions';
import {
  selectPreferences,
  selectSettingsLoading,
  selectSettingsSaving,
} from './settings.selectors';
import { UserPreferences } from '../domain/settings.entity';

@Injectable({ providedIn: 'root' })
export class SettingsFacade {
  private readonly store = inject(Store);

  readonly preferences = this.store.selectSignal(selectPreferences);
  readonly loading = this.store.selectSignal(selectSettingsLoading);
  readonly saving = this.store.selectSignal(selectSettingsSaving);

  load(): void {
    this.store.dispatch(SettingsActions.load());
  }

  save(preferences: UserPreferences): void {
    this.store.dispatch(SettingsActions.save({ preferences }));
  }

  reset(): void {
    this.store.dispatch(SettingsActions.reset());
  }
}
