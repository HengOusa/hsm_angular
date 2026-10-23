import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {
  PageHeaderComponent,
  StatusBadgeComponent,
  LoadingSkeletonComponent,
  EmptyStateComponent,
  type StatusVariant,
} from '../../../../shared';
import { AppointmentFacade } from '../../store/appointment.facade';
import { Appointment, AppointmentStatus } from '../../domain/appointment.entity';

@Component({
  selector: 'mc-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    PageHeaderComponent,
    StatusBadgeComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent,
  ],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentListComponent implements OnInit {
  readonly facade = inject(AppointmentFacade);

  ngOnInit(): void {
    this.facade.search({ date: this.facade.dateFilter() });
  }

  onDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (value) this.facade.setDate(value);
  }

  shiftDay(delta: number): void {
    const d = new Date(this.facade.dateFilter() + 'T12:00:00');
    d.setDate(d.getDate() + delta);
    this.facade.setDate(d.toISOString().slice(0, 10));
  }

  statusVariant(status: AppointmentStatus): StatusVariant {
    const map: Record<AppointmentStatus, StatusVariant> = {
      Pending: 'pending',
      Confirmed: 'confirmed',
      InProgress: 'in-progress',
      Completed: 'completed',
      Cancelled: 'cancelled',
      NoShow: 'abnormal',
    };
    return map[status];
  }

  typeColor(type: Appointment['type']): string {
    switch (type) {
      case 'Emergency':
        return 'alert';
      case 'Telemedicine':
        return 'primary';
      case 'WalkIn':
        return 'warning';
      default:
        return 'accent';
    }
  }

  setStatus(id: string, status: AppointmentStatus): void {
    this.facade.updateStatus(id, status);
  }
}
