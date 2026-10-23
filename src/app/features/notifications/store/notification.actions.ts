import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AppNotification } from '../domain/notification.entity';

export const NotificationActions = createActionGroup({
  source: 'AppNotifications',
  events: {
    'Load': emptyProps(),
    'Load Success': props<{ items: AppNotification[] }>(),
    'Load Failure': props<{ error: string }>(),

    'Mark Read': props<{ id: string }>(),
    'Mark Read Success': props<{ item: AppNotification }>(),

    'Mark All Read': emptyProps(),
    'Mark All Read Success': props<{ items: AppNotification[] }>(),

    'Push': props<{ item: AppNotification }>(),
  },
});
