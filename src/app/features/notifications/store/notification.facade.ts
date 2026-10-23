import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationActions } from './notification.actions';
import {
  selectNotifications,
  selectNotificationsLoading,
  selectUnreadCount,
  selectUnreadNotifications,
} from './notification.selectors';

@Injectable({ providedIn: 'root' })
export class NotificationFacade {
  private readonly store = inject(Store);

  readonly items = this.store.selectSignal(selectNotifications);
  readonly loading = this.store.selectSignal(selectNotificationsLoading);
  readonly unreadCount = this.store.selectSignal(selectUnreadCount);
  readonly unread = this.store.selectSignal(selectUnreadNotifications);

  load(): void {
    this.store.dispatch(NotificationActions.load());
  }

  markRead(id: string): void {
    this.store.dispatch(NotificationActions.markRead({ id }));
  }

  markAllRead(): void {
    this.store.dispatch(NotificationActions.markAllRead());
  }
}
