import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
  type StatusVariant,
} from '../../../../shared';
import { BillingFacade } from '../../store/billing.facade';
import { AuthFacade } from '../../../../store/auth/auth.facade';
import {
  Invoice,
  InvoiceStatus,
  PaymentMethod,
  ChargeCategory,
} from '../../domain/billing.entity';

@Component({
  selector: 'mc-billing-workspace',
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
    PageHeaderComponent,
    StatCardComponent,
    SearchBarComponent,
    StatusBadgeComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent,
  ],
  templateUrl: './billing-workspace.component.html',
  styleUrl: './billing-workspace.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingWorkspaceComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly facade = inject(BillingFacade);
  private readonly auth = inject(AuthFacade);

  readonly statusFilter = signal<string>('ALL');
  readonly payAmount = signal<Record<string, number>>({});

  readonly patients = [
    { id: 'pat-001', name: 'Amina Hassan' },
    { id: 'pat-002', name: 'James Okello' },
    { id: 'pat-003', name: 'Sofia Martinez' },
    { id: 'pat-004', name: 'Wei Chen' },
  ];
  readonly categories: ChargeCategory[] = [
    'Consultation',
    'Procedure',
    'Lab',
    'Pharmacy',
    'Room',
    'Emergency',
    'Other',
  ];
  readonly methods: PaymentMethod[] = [
    'Cash',
    'Card',
    'Insurance',
    'BankTransfer',
    'Other',
  ];

  readonly invoiceForm = this.fb.nonNullable.group({
    patientId: ['pat-001', Validators.required],
    department: ['OPD', Validators.required],
    dueDays: [7, [Validators.required, Validators.min(0)]],
    discount: [0, Validators.min(0)],
    notes: [''],
    lines: this.fb.array([
      this.fb.nonNullable.group({
        description: ['Consultation fee', Validators.required],
        category: ['Consultation' as ChargeCategory, Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
        unitPrice: [50, [Validators.required, Validators.min(0)]],
      }),
    ]),
  });

  get lines(): FormArray {
    return this.invoiceForm.controls.lines;
  }

  ngOnInit(): void {
    this.facade.load();
  }

  setStatus(status: string): void {
    this.statusFilter.set(status);
    this.facade.load(status === 'ALL' ? undefined : status);
  }

  onSearch(query: string): void {
    this.facade.load(
      this.statusFilter() === 'ALL' ? undefined : this.statusFilter(),
      query
    );
  }

  statusVariant(status: InvoiceStatus): StatusVariant {
    const map: Record<InvoiceStatus, StatusVariant> = {
      Draft: 'pending',
      Issued: 'confirmed',
      PartiallyPaid: 'in-progress',
      Paid: 'completed',
      Void: 'cancelled',
      Overdue: 'critical',
    };
    return map[status];
  }

  addLine(): void {
    this.lines.push(
      this.fb.nonNullable.group({
        description: ['', Validators.required],
        category: ['Other' as ChargeCategory, Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
        unitPrice: [0, [Validators.required, Validators.min(0)]],
      })
    );
  }

  removeLine(i: number): void {
    if (this.lines.length > 1) this.lines.removeAt(i);
  }

  submitInvoice(): void {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      return;
    }
    const v = this.invoiceForm.getRawValue();
    const patient = this.patients.find((p) => p.id === v.patientId)!;
    this.facade.createInvoice({
      patientId: v.patientId,
      patientName: patient.name,
      department: v.department,
      dueDays: v.dueDays,
      discount: v.discount,
      notes: v.notes || undefined,
      lines: v.lines.map((l) => ({
        description: l.description,
        category: l.category,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
      })),
    });
  }

  setPayAmount(id: string, value: string): void {
    const n = parseFloat(value);
    this.payAmount.update((m) => ({ ...m, [id]: Number.isFinite(n) ? n : 0 }));
  }

  pay(inv: Invoice, method: PaymentMethod = 'Cash'): void {
    const amount = this.payAmount()[inv.id] ?? inv.balance;
    if (amount <= 0) return;
    const user = this.auth.user();
    this.facade.recordPayment({
      invoiceId: inv.id,
      amount,
      method,
      receivedBy: user ? `${user.firstName} ${user.lastName}` : 'Cashier',
    });
  }
}
