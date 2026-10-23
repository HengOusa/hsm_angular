import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationsState } from './notification.reducer';
import { unreadCount } from '../domain/notification.entity';

export const selectNotificationsState =
  createFeatureSelector<NotificationsState>('notifications');

export const selectNotifications = createSelector(
  selectNotificationsState,
  (s) => s.items
);
export const selectNotificationsLoading = createSelector(
  selectNotificationsState,
  (s) => s.loading
);
export const selectUnreadCount = createSelector(selectNotifications, unreadCount);
export const selectUnreadNotifications = createSelector(selectNotifications, (items) =>
  items.filter((n) => !n.read)
);
