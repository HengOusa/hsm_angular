import { createReducer, on } from '@ngrx/store';
import { AppNotification } from '../domain/notification.entity';
import { NotificationActions } from './notification.actions';

export interface NotificationsState {
  items: AppNotification[];
  loading: boolean;
  error: string | null;
}

export const initialNotificationsState: NotificationsState = {
  items: [],
  loading: false,
  error: null,
};

export const notificationsReducer = createReducer(
  initialNotificationsState,

  on(NotificationActions.load, (s) => ({ ...s, loading: true, error: null })),
  on(NotificationActions.loadSuccess, (s, { items }) => ({
    ...s,
    items,
    loading: false,
  })),
  on(NotificationActions.loadFailure, (s, { error }) => ({
    ...s,
    loading: false,
    error,
  })),

  on(NotificationActions.markReadSuccess, (s, { item }) => ({
    ...s,
    items: s.items.map((n) => (n.id === item.id ? item : n)),
  })),

  on(NotificationActions.markAllReadSuccess, (s, { items }) => ({
    ...s,
    items,
  })),

  on(NotificationActions.push, (s, { item }) => ({
    ...s,
    items: [item, ...s.items],
  }))
);
