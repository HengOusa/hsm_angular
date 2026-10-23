import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { AppNotification } from '../domain/notification.entity';

@Injectable({ providedIn: 'root' })
export class NotificationMockRepository {
  private seq = 8;
  private items: AppNotification[] = [
    {
      id: 'n-001',
      type: 'critical',
      title: 'Critical lab result',
      message: 'Potassium 6.5 mmol/L · James Okello · notify Dr. Sarah Chen',
      route: '/laboratory',
      read: false,
      createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
      source: 'Laboratory',
    },
    {
      id: 'n-002',
      type: 'emergency',
      title: 'Trauma team activated',
      message: 'ER-2026-0002 · Unknown Male · Resus-1',
      route: '/emergency',
      read: false,
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
      source: 'Emergency',
    },
    {
      id: 'n-003',
      type: 'pharmacy',
      title: 'Drug interaction',
      message: 'Warfarin + Aspirin · RX-2026-0002 · Amina Hassan',
      route: '/pharmacy',
      read: false,
      createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
      source: 'Pharmacy',
    },
    {
      id: 'n-004',
      type: 'warning',
      title: 'Low stock',
      message: 'Paracetamol and Salbutamol below reorder level',
      route: '/pharmacy',
      read: true,
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      source: 'Pharmacy',
    },
    {
      id: 'n-005',
      type: 'roster',
      title: 'Shift conflict',
      message: 'Dr. Raj Patel has overlapping Morning and Afternoon shifts today',
      route: '/staff',
      read: false,
      createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
      source: 'Staff',
    },
    {
      id: 'n-006',
      type: 'billing',
      title: 'Overdue invoice',
      message: 'INV-2026-0002 · James Okello still has an open balance',
      route: '/billing',
      read: true,
      createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
      source: 'Billing',
    },
    {
      id: 'n-007',
      type: 'info',
      title: 'Bed status',
      message: 'ICU-03 moved to Cleaning · available soon',
      route: '/beds',
      read: true,
      createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
      source: 'Ward',
    },
  ];

  list(): Observable<AppNotification[]> {
    const sorted = [...this.items].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
    return of(sorted).pipe(delay(120));
  }

  markRead(id: string): Observable<AppNotification> {
    const idx = this.items.findIndex((n) => n.id === id);
    if (idx < 0) throw new Error('Not found');
    const updated = { ...this.items[idx], read: true };
    this.items = [...this.items.slice(0, idx), updated, ...this.items.slice(idx + 1)];
    return of(updated).pipe(delay(80));
  }

  markAllRead(): Observable<AppNotification[]> {
    this.items = this.items.map((n) => ({ ...n, read: true }));
    return this.list();
  }

  add(partial: Omit<AppNotification, 'id' | 'read' | 'createdAt'>): Observable<AppNotification> {
    const item: AppNotification = {
      ...partial,
      id: `n-${String(this.seq++).padStart(3, '0')}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.items = [item, ...this.items];
    return of(item).pipe(delay(50));
  }
}
