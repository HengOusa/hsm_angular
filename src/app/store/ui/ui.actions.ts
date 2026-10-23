import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const UiActions = createActionGroup({
  source: 'UI',
  events: {
    'Show Loading': emptyProps(),
    'Hide Loading': emptyProps(),
    'Toggle Dark Mode': emptyProps(),
    'Set Dark Mode': props<{ enabled: boolean }>(),
    'Toggle Sidebar': emptyProps(),
    'Set Sidebar Collapsed': props<{ collapsed: boolean }>(),
  },
});
