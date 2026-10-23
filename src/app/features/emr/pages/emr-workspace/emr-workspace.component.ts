import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import {
  PageHeaderComponent,
  LoadingSkeletonComponent,
  EmptyStateComponent,
  StatusBadgeComponent,
  VitalChartComponent,
  MedicalCodePipe,
  TimeAgoPipe,
  type VitalPoint,
} from '../../../../shared';
import {
  systolicBpValidator,
  diastolicBpValidator,
  heartRateValidator,
  temperatureValidator,
  spo2Validator,
  painScaleValidator,
} from '../../../../shared';
import { EmrFacade } from '../../store/emr.facade';
import { AuthFacade } from '../../../../store/auth/auth.facade';
import { Icd10Code } from '../../domain/emr.entity';

@Component({
  selector: 'mc-emr-workspace',
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
    MatChipsModule,
    PageHeaderComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
    VitalChartComponent,
    MedicalCodePipe,
    TimeAgoPipe,
  ],
  templateUrl: './emr-workspace.component.html',
  styleUrl: './emr-workspace.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmrWorkspaceComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly facade = inject(EmrFacade);
  private readonly auth = inject(AuthFacade);

  readonly selectedDiagnoses = signal<Icd10Code[]>([]);
  readonly icdQuery = signal('');

  readonly patients = [
    { id: 'pat-001', name: 'Amina Hassan' },
    { id: 'pat-002', name: 'James Okello' },
    { id: 'pat-003', name: 'Sofia Martinez' },
    { id: 'pat-004', name: 'Wei Chen' },
  ];

  readonly soapForm = this.fb.nonNullable.group({
    patientId: ['pat-002', Validators.required],
    visitDate: [new Date().toISOString().slice(0, 10), Validators.required],
    subjective: ['', Validators.required],
    objective: [''],
    assessment: ['', Validators.required],
    plan: ['', Validators.required],
  });

  readonly vitalsForm = this.fb.nonNullable.group({
    patientId: ['pat-002', Validators.required],
    bloodPressureSystolic: [null as number | null, systolicBpValidator()],
    bloodPressureDiastolic: [null as number | null, diastolicBpValidator()],
    heartRate: [null as number | null, heartRateValidator()],
    temperature: [null as number | null, temperatureValidator()],
    spo2: [null as number | null, spo2Validator()],
    respiratoryRate: [null as number | null],
    bloodGlucose: [null as number | null],
    weight: [null as number | null],
    height: [null as number | null],
    pain: [null as number | null, painScaleValidator()],
    notes: [''],
  });

  ngOnInit(): void {
    this.facade.loadNotes();
    this.facade.loadVitals();
    this.facade.searchIcd('');
  }

  patientName(id: string): string {
    return this.patients.find((p) => p.id === id)?.name ?? id;
  }

  onIcdSearch(event: Event): void {
    const q = (event.target as HTMLInputElement).value;
    this.icdQuery.set(q);
    this.facade.searchIcd(q);
  }

  addDiagnosis(code: Icd10Code): void {
    const list = this.selectedDiagnoses();
    if (!list.some((d) => d.code === code.code)) {
      this.selectedDiagnoses.set([...list, code]);
    }
  }

  removeDiagnosis(code: string): void {
    this.selectedDiagnoses.set(this.selectedDiagnoses().filter((d) => d.code !== code));
  }

  saveSoap(): void {
    if (this.soapForm.invalid) {
      this.soapForm.markAllAsTouched();
      return;
    }
    const v = this.soapForm.getRawValue();
    const user = this.auth.user();
    this.facade.saveNote({
      patientId: v.patientId,
      patientName: this.patientName(v.patientId),
      authorId: user?.id ?? 'usr-001',
      authorName: user ? `${user.firstName} ${user.lastName}` : 'Clinician',
      visitDate: v.visitDate,
      subjective: v.subjective.trim(),
      objective: v.objective.trim(),
      assessment: v.assessment.trim(),
      plan: v.plan.trim(),
      diagnoses: this.selectedDiagnoses(),
    });
    this.soapForm.patchValue({
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
    });
    this.selectedDiagnoses.set([]);
  }

  saveVitals(): void {
    if (this.vitalsForm.invalid) {
      this.vitalsForm.markAllAsTouched();
      return;
    }
    const v = this.vitalsForm.getRawValue();
    const user = this.auth.user();
    this.facade.saveVitals({
      patientId: v.patientId,
      recordedBy: user ? `${user.firstName} ${user.lastName}` : 'Staff',
      recordedAt: new Date().toISOString(),
      bloodPressureSystolic: v.bloodPressureSystolic ?? undefined,
      bloodPressureDiastolic: v.bloodPressureDiastolic ?? undefined,
      heartRate: v.heartRate ?? undefined,
      temperature: v.temperature ?? undefined,
      spo2: v.spo2 ?? undefined,
      respiratoryRate: v.respiratoryRate ?? undefined,
      bloodGlucose: v.bloodGlucose ?? undefined,
      weight: v.weight ?? undefined,
      height: v.height ?? undefined,
      pain: v.pain ?? undefined,
      notes: v.notes?.trim() || undefined,
    });
  }

  hrPoints(): VitalPoint[] {
    return this.facade
      .vitals()
      .filter((v) => v.heartRate != null)
      .slice(0, 8)
      .reverse()
      .map((v) => ({ timestamp: v.recordedAt, value: v.heartRate! }));
  }
}
