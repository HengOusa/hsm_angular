import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  PageHeaderComponent,
  LoadingSkeletonComponent,
  EmptyStateComponent,
  TimeAgoPipe,
} from '../../../../shared';
import { NotificationFacade } from '../../store/notification.facade';
import { AppNotification, AppNotificationType } from '../../domain/notification.entity';
import { signal } from '@angular/core';

@Component({
  selector: 'mc-notification-center',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    PageHeaderComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent,
    TimeAgoPipe,
  ],
  templateUrl: './notification-center.component.html',
  styleUrl: './notification-center.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCenterComponent implements OnInit {
  readonly facade = inject(NotificationFacade);
  readonly filter = signal<'all' | 'unread'>('all');

  ngOnInit(): void {
    this.facade.load();
  }

  visible(): AppNotification[] {
    const items = this.facade.items();
    return this.filter() === 'unread' ? items.filter((n) => !n.read) : items;
  }

  icon(type: AppNotificationType): string {
    const map: Record<AppNotificationType, string> = {
      info: 'info',
      success: 'check_circle',
      warning: 'warning',
      critical: 'error',
      lab: 'science',
      pharmacy: 'medication',
      emergency: 'emergency',
      billing: 'receipt_long',
      roster: 'groups',
    };
    return map[type] ?? 'notifications';
  }

  markRead(n: AppNotification): void {
    if (!n.read) this.facade.markRead(n.id);
  }
}
