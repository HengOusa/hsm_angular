import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {
  PageHeaderComponent,
  SearchBarComponent,
  StatusBadgeComponent,
  LoadingSkeletonComponent,
  EmptyStateComponent,
  AgePipe,
  type StatusVariant,
} from '../../../../shared';
import { PatientFacade } from '../../store/patient.facade';
import { Patient, PatientStatus, patientFullName } from '../../domain/patient.entity';

@Component({
  selector: 'mc-patient-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    PageHeaderComponent,
    SearchBarComponent,
    StatusBadgeComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent,
    AgePipe,
  ],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientListComponent implements OnInit {
  readonly facade = inject(PatientFacade);

  readonly statusOptions: { value: PatientStatus | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'OPD', label: 'OPD' },
    { value: 'IPD', label: 'IPD' },
    { value: 'ICU', label: 'ICU' },
    { value: 'ER', label: 'ER' },
    { value: 'Discharged', label: 'Discharged' },
  ];

  ngOnInit(): void {
    this.facade.search({ page: 0 });
  }

  onSearch(query: string): void {
    this.facade.setQuery(query);
  }

  onStatus(status: PatientStatus | 'ALL'): void {
    this.facade.setStatusFilter(status);
  }

  onPage(event: PageEvent): void {
    this.facade.search({ page: event.pageIndex, pageSize: event.pageSize });
  }

  fullName(p: Patient): string {
    return patientFullName(p);
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
}
