import { Component, ChangeDetectionStrategy, inject, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import {
  PageHeaderComponent,
  StatusBadgeComponent,
  LoadingSkeletonComponent,
  TimelineComponent,
  AgePipe,
  BloodGroupPipe,
  TimeAgoPipe,
  type StatusVariant,
  type TimelineItem,
} from '../../../../shared';
import { PatientFacade } from '../../store/patient.facade';
import { PatientStatus, patientFullName } from '../../domain/patient.entity';

@Component({
  selector: 'mc-patient-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    PageHeaderComponent,
    StatusBadgeComponent,
    LoadingSkeletonComponent,
    TimelineComponent,
    AgePipe,
    BloodGroupPipe,
    TimeAgoPipe,
  ],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientDetailComponent implements OnInit {
  /** Route param via withComponentInputBinding */
  readonly id = input.required<string>();

  readonly facade = inject(PatientFacade);

  ngOnInit(): void {
    this.facade.loadOne(this.id());
  }

  fullName(): string {
    const p = this.facade.selected();
    return p ? patientFullName(p) : '';
  }

  statusVariant(status: PatientStatus): StatusVariant {
    const map: Record<PatientStatus, StatusVariant> = {
      OPD: 'confirmed',
      IPD: 'in-progress',
      ICU: 'critical',
      ER: 'urgent',
      Discharged: 'completed',
    };
    return map[status];
  }

  timeline(): TimelineItem[] {
    const p = this.facade.selected();
    if (!p) return [];
    const items: TimelineItem[] = [
      {
        id: 'reg',
        title: 'Registered',
        subtitle: `MRN ${p.mrn}`,
        timestamp: p.createdAt,
        icon: 'how_to_reg',
        color: 'primary',
      },
    ];
    if (p.admissionDate) {
      items.push({
        id: 'adm',
        title: 'Admitted',
        subtitle: p.wardId ? `Ward ${p.wardId}` : p.status,
        timestamp: p.admissionDate,
        icon: 'login',
        color: 'accent',
      });
    }
    if (p.dischargeDate) {
      items.push({
        id: 'dis',
        title: 'Discharged',
        timestamp: p.dischargeDate,
        icon: 'logout',
        color: 'neutral',
      });
    }
    items.push({
      id: 'upd',
      title: 'Last updated',
      timestamp: p.updatedAt,
      icon: 'update',
      color: 'neutral',
    });
    return items;
  }
}
