import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  PageHeaderComponent,
  StatCardComponent,
  SearchBarComponent,
  StatusBadgeComponent,
  LoadingSkeletonComponent,
  EmptyStateComponent,
  AlertBannerComponent,
  type StatusVariant,
} from '../../../../shared';
import { PharmacyFacade } from '../../store/pharmacy.facade';
import { AuthFacade } from '../../../../store/auth/auth.facade';
import { PrescriptionStatus, Drug } from '../../domain/pharmacy.entity';

@Component({
  selector: 'mc-pharmacy-workspace',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    PageHeaderComponent,
    StatCardComponent,
    SearchBarComponent,
    StatusBadgeComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent,
    AlertBannerComponent,
  ],
  templateUrl: './pharmacy-workspace.component.html',
  styleUrl: './pharmacy-workspace.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyWorkspaceComponent implements OnInit {
  readonly facade = inject(PharmacyFacade);
  private readonly auth = inject(AuthFacade);

  readonly lowStockOnly = signal(false);
  readonly rxFilter = signal<PrescriptionStatus | 'ALL'>('Pending');

  ngOnInit(): void {
    this.facade.loadInventory();
    this.facade.loadPrescriptions('Pending');
  }

  onSearch(query: string): void {
    this.facade.loadInventory(query, this.lowStockOnly());
  }

  toggleLowStock(): void {
    this.lowStockOnly.update((v) => !v);
    this.facade.loadInventory(undefined, this.lowStockOnly());
  }

  setRxFilter(status: PrescriptionStatus | 'ALL'): void {
    this.rxFilter.set(status);
    this.facade.loadPrescriptions(status);
  }

  statusVariant(status: PrescriptionStatus): StatusVariant {
    const map: Record<PrescriptionStatus, StatusVariant> = {
      Pending: 'pending',
      Dispensing: 'in-progress',
      Dispensed: 'completed',
      Cancelled: 'cancelled',
    };
    return map[status];
  }

  isLowStock(d: Drug): boolean {
    return d.stockQty <= d.reorderLevel;
  }

  isExpiringSoon(d: Drug): boolean {
    const exp = new Date(d.expiryDate).getTime();
    const in90 = Date.now() + 90 * 24 * 60 * 60 * 1000;
    return exp <= in90;
  }

  dispense(id: string): void {
    const user = this.auth.user();
    const name = user ? `${user.firstName} ${user.lastName}` : 'Pharmacist';
    this.facade.dispense(id, name);
  }

  cancel(id: string): void {
    this.facade.cancel(id);
  }
}
