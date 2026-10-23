import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  PageHeaderComponent,
  StatCardComponent,
  SearchBarComponent,
  StatusBadgeComponent,
  LoadingSkeletonComponent,
  EmptyStateComponent,
  AlertBannerComponent,
  TimeAgoPipe,
  type StatusVariant,
} from '../../../../shared';
import { LabFacade } from '../../store/lab.facade';
import { AuthFacade } from '../../../../store/auth/auth.facade';
import { LabTest, LabTestStatus } from '../../domain/lab.entity';

@Component({
  selector: 'mc-lab-workspace',
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
    MatCheckboxModule,
    PageHeaderComponent,
    StatCardComponent,
    SearchBarComponent,
    StatusBadgeComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent,
    AlertBannerComponent,
    TimeAgoPipe,
  ],
  templateUrl: './lab-workspace.component.html',
  styleUrl: './lab-workspace.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabWorkspaceComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly facade = inject(LabFacade);
  private readonly auth = inject(AuthFacade);

  readonly statusFilter = signal<LabTestStatus | 'ALL'>('ALL');
  readonly resultDraft = signal<Record<string, string>>({});

  readonly patients = [
    { id: 'pat-001', name: 'Amina Hassan' },
    { id: 'pat-002', name: 'James Okello' },
    { id: 'pat-003', name: 'Sofia Martinez' },
    { id: 'pat-004', name: 'Wei Chen' },
  ];

  readonly orderForm = this.fb.nonNullable.group({
    patientId: ['pat-002', Validators.required],
    testCodes: [[] as string[], Validators.required],
  });

  ngOnInit(): void {
    this.facade.load({});
  }

  setStatusFilter(status: LabTestStatus | 'ALL'): void {
    this.statusFilter.set(status);
    this.facade.load({ status });
  }

  onSearch(query: string): void {
    this.facade.load({ query, status: this.statusFilter() });
  }

  statusVariant(status: LabTestStatus): StatusVariant {
    const map: Record<LabTestStatus, StatusVariant> = {
      Ordered: 'pending',
      SampleCollected: 'confirmed',
      Processing: 'in-progress',
      Completed: 'confirmed',
      Reported: 'completed',
    };
    return map[status];
  }

  toggleCode(code: string, checked: boolean): void {
    const current = [...this.orderForm.controls.testCodes.value];
    if (checked && !current.includes(code)) {
      this.orderForm.controls.testCodes.setValue([...current, code]);
    } else if (!checked) {
      this.orderForm.controls.testCodes.setValue(current.filter((c) => c !== code));
    }
  }

  isCodeSelected(code: string): boolean {
    return this.orderForm.controls.testCodes.value.includes(code);
  }

  submitOrder(): void {
    if (this.orderForm.invalid || !this.orderForm.controls.testCodes.value.length) {
      this.orderForm.markAllAsTouched();
      return;
    }
    const v = this.orderForm.getRawValue();
    const patient = this.patients.find((p) => p.id === v.patientId)!;
    const user = this.auth.user();
    this.facade.createOrder({
      patientId: v.patientId,
      patientName: patient.name,
      orderedBy: user?.id ?? 'doc-001',
      orderedByName: user ? `Dr. ${user.firstName} ${user.lastName}` : 'Dr. Chen',
      testCodes: v.testCodes,
    });
    this.orderForm.controls.testCodes.setValue([]);
  }

  advance(test: LabTest): void {
    const flow: LabTestStatus[] = [
      'Ordered',
      'SampleCollected',
      'Processing',
      'Completed',
      'Reported',
    ];
    const i = flow.indexOf(test.status);
    if (i >= 0 && i < flow.length - 1 && flow[i + 1] !== 'Reported') {
      this.facade.updateStatus(test.id, flow[i + 1]);
    }
  }

  setDraft(id: string, value: string): void {
    this.resultDraft.update((m) => ({ ...m, [id]: value }));
  }

  report(test: LabTest): void {
    const raw = this.resultDraft()[test.id]?.trim();
    if (!raw) return;
    const numeric = parseFloat(raw);
    const user = this.auth.user();
    const reportedBy = user ? `${user.firstName} ${user.lastName}` : 'Lab Tech';
    this.facade.enterResult(
      test.id,
      raw,
      reportedBy,
      Number.isFinite(numeric) ? numeric : undefined
    );
  }
}
