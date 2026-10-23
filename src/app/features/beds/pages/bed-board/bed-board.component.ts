import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  PageHeaderComponent,
  StatCardComponent,
  LoadingSkeletonComponent,
  EmptyStateComponent,
  StatusBadgeComponent,
  type StatusVariant,
} from '../../../../shared';
import { BedFacade } from '../../store/bed.facade';
import { Bed, BedStatus } from '../../domain/bed.entity';

@Component({
  selector: 'mc-bed-board',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatTooltipModule,
    PageHeaderComponent,
    StatCardComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './bed-board.component.html',
  styleUrl: './bed-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BedBoardComponent implements OnInit {
  readonly facade = inject(BedFacade);

  readonly statuses: { value: BedStatus | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'Available', label: 'Available' },
    { value: 'Occupied', label: 'Occupied' },
    { value: 'Cleaning', label: 'Cleaning' },
    { value: 'Reserved', label: 'Reserved' },
    { value: 'Maintenance', label: 'Maintenance' },
  ];

  ngOnInit(): void {
    this.facade.load();
  }

  statusVariant(status: BedStatus): StatusVariant {
    const map: Record<BedStatus, StatusVariant> = {
      Available: 'available',
      Occupied: 'occupied',
      Cleaning: 'cleaning',
      Reserved: 'reserved',
      Maintenance: 'maintenance',
    };
    return map[status];
  }

  setStatus(bed: Bed, status: BedStatus): void {
    if (status === 'Occupied' && !bed.currentPatientId) {
      this.facade.updateStatus(bed.id, status, {
        id: 'pat-temp',
        name: 'Walk-in patient',
      });
    } else {
      this.facade.updateStatus(bed.id, status);
    }
  }

  featureIcons(bed: Bed): string {
    const f = bed.features;
    const parts: string[] = [];
    if (f.oxygen) parts.push('O₂');
    if (f.monitor) parts.push('Mon');
    if (f.ventilator) parts.push('Vent');
    if (f.suction) parts.push('Suc');
    return parts.join(' · ') || '—';
  }
}
