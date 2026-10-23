import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserPreferences } from '../domain/settings.entity';

export const SettingsActions = createActionGroup({
  source: 'Settings',
  events: {
    'Load': emptyProps(),
    'Load Success': props<{ preferences: UserPreferences }>(),
    'Save': props<{ preferences: UserPreferences }>(),
    'Save Success': props<{ preferences: UserPreferences }>(),
    'Reset': emptyProps(),
    'Reset Success': props<{ preferences: UserPreferences }>(),
    'Failure': props<{ error: string }>(),
  },
});
