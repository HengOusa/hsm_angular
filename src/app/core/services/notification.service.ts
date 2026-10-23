import { Injectable, signal, computed } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notificationsSignal = signal<AppNotification[]>([]);
  private readonly loadingCountSignal = signal(0);

  readonly notifications = this.notificationsSignal.asReadonly();
  readonly isLoading = computed(() => this.loadingCountSignal() > 0);

  success(message: string, duration = 4000): void {
    this.push('success', message, duration);
  }

  error(message: string, duration = 6000): void {
    this.push('error', message, duration);
  }

  warning(message: string, duration = 5000): void {
    this.push('warning', message, duration);
  }

  info(message: string, duration = 4000): void {
    this.push('info', message, duration);
  }

  showLoading(): void {
    this.loadingCountSignal.update((c) => c + 1);
  }

  hideLoading(): void {
    this.loadingCountSignal.update((c) => Math.max(0, c - 1));
  }

  dismiss(id: string): void {
    this.notificationsSignal.update((list) => list.filter((n) => n.id !== id));
  }

  private push(type: NotificationType, message: string, duration: number): void {
    const id = `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const notification: AppNotification = { id, type, message, duration };
    this.notificationsSignal.update((list) => [...list, notification]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }
}
