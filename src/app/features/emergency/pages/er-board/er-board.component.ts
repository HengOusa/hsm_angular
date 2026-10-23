import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import {
  PageHeaderComponent,
  StatCardComponent,
  StatusBadgeComponent,
  LoadingSkeletonComponent,
  EmptyStateComponent,
  AlertBannerComponent,
  TimeAgoPipe,
  type StatusVariant,
} from '../../../../shared';
import { EmergencyFacade } from '../../store/emergency.facade';
import {
  TriageLevel,
  EmergencyCaseStatus,
  ArrivalMode,
  EmergencyCase,
} from '../../domain/emergency.entity';

@Component({
  selector: 'mc-er-board',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatMenuModule,
    PageHeaderComponent,
    StatCardComponent,
    StatusBadgeComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent,
    AlertBannerComponent,
    TimeAgoPipe,
  ],
  templateUrl: './er-board.component.html',
  styleUrl: './er-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErBoardComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly facade = inject(EmergencyFacade);

  readonly triageLevels: TriageLevel[] = [
    'Immediate',
    'Urgent',
    'LessUrgent',
    'NonUrgent',
  ];
  readonly arrivalModes: ArrivalMode[] = [
    'WalkIn',
    'Ambulance',
    'Police',
    'Transfer',
    'Other',
  ];

  readonly form = this.fb.nonNullable.group({
    patientName: ['', [Validators.required, Validators.minLength(2)]],
    ageYears: [null as number | null],
    gender: ['Unknown'],
    triageLevel: ['Urgent' as TriageLevel, Validators.required],
    chiefComplaint: ['', Validators.required],
    arrivalMode: ['WalkIn' as ArrivalMode, Validators.required],
    notes: [''],
  });

  ngOnInit(): void {
    this.facade.load();
  }

  triageVariant(level: TriageLevel): StatusVariant {
    const map: Record<TriageLevel, StatusVariant> = {
      Immediate: 'immediate',
      Urgent: 'urgent',
      LessUrgent: 'less-urgent',
      NonUrgent: 'non-urgent',
      Deceased: 'deceased',
    };
    return map[level];
  }

  statusVariant(status: EmergencyCaseStatus): StatusVariant {
    const map: Record<EmergencyCaseStatus, StatusVariant> = {
      Triaging: 'pending',
      InProgress: 'in-progress',
      Admitted: 'confirmed',
      Discharged: 'completed',
      Transferred: 'reserved',
      Expired: 'deceased',
    };
    return map[status];
  }

  waitMinutes(c: EmergencyCase): number {
    const start = new Date(c.arrivalTime).getTime();
    return Math.max(0, Math.floor((Date.now() - start) / 60000));
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const now = new Date().toISOString();
    this.facade.create({
      patientName: v.patientName.trim(),
      ageYears: v.ageYears ?? undefined,
      gender: v.gender,
      triageLevel: v.triageLevel,
      chiefComplaint: v.chiefComplaint.trim(),
      arrivalMode: v.arrivalMode,
      arrivalTime: now,
      triageTime: now,
      status: 'Triaging',
      notes: v.notes?.trim() || undefined,
    });
    this.form.reset({
      patientName: '',
      ageYears: null,
      gender: 'Unknown',
      triageLevel: 'Urgent',
      chiefComplaint: '',
      arrivalMode: 'WalkIn',
      notes: '',
    });
  }

  startCare(c: EmergencyCase): void {
    this.facade.update(c.id, {
      status: 'InProgress',
      doctorSeenTime: new Date().toISOString(),
      assignedDoctor: c.assignedDoctor ?? 'On-duty physician',
    });
  }

  admit(c: EmergencyCase): void {
    this.facade.update(c.id, {
      status: 'Admitted',
      disposition: 'Admitted to ward',
      dispositionTime: new Date().toISOString(),
    });
  }

  discharge(c: EmergencyCase): void {
    this.facade.update(c.id, {
      status: 'Discharged',
      disposition: 'Discharged home',
      dispositionTime: new Date().toISOString(),
    });
  }

  trauma(c: EmergencyCase): void {
    this.facade.activateTrauma(c.id);
  }
}
