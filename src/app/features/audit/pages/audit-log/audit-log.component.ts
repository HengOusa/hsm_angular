import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  PageHeaderComponent,
  SearchBarComponent,
  StatusBadgeComponent,
  LoadingSkeletonComponent,
  EmptyStateComponent,
  TimeAgoPipe,
  type StatusVariant,
} from '../../../../shared';
import { AuditFacade } from '../../store/audit.facade';
import { AuditAction } from '../../domain/audit.entity';

@Component({
  selector: 'mc-audit-log',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    PageHeaderComponent,
    SearchBarComponent,
    StatusBadgeComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent,
    TimeAgoPipe,
  ],
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogComponent implements OnInit {
  readonly facade = inject(AuditFacade);
  readonly actionFilter = signal<AuditAction | 'ALL'>('ALL');

  readonly actions: (AuditAction | 'ALL')[] = [
    'ALL',
    'LOGIN',
    'CREATE',
    'UPDATE',
    'STATUS_CHANGE',
    'DISPENSE',
    'REPORT',
    'PAYMENT',
  ];

  ngOnInit(): void {
    this.facade.load();
  }

  setAction(a: AuditAction | 'ALL'): void {
    this.actionFilter.set(a);
    this.facade.load(a);
  }

  onSearch(query: string): void {
    this.facade.load(this.actionFilter(), query);
  }

  actionVariant(action: AuditAction): StatusVariant {
    const map: Partial<Record<AuditAction, StatusVariant>> = {
      LOGIN: 'confirmed',
      LOGOUT: 'pending',
      CREATE: 'completed',
      UPDATE: 'in-progress',
      DELETE: 'cancelled',
      DISPENSE: 'confirmed',
      REPORT: 'critical',
      PAYMENT: 'completed',
      STATUS_CHANGE: 'urgent',
      VIEW: 'pending',
    };
    return map[action] ?? 'pending';
  }
}
