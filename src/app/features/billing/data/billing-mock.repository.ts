import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  Invoice,
  InvoiceLine,
  Payment,
  PaymentMethod,
  RevenueSnapshot,
  recalcInvoice,
  deriveStatus,
} from '../domain/billing.entity';

function line(
  id: string,
  description: string,
  category: InvoiceLine['category'],
  quantity: number,
  unitPrice: number
): InvoiceLine {
  return {
    id,
    description,
    category,
    quantity,
    unitPrice,
    amount: Math.round(quantity * unitPrice * 100) / 100,
  };
}

@Injectable({ providedIn: 'root' })
export class BillingMockRepository {
  private invSeq = 4;
  private paySeq = 2;
  private invoices: Invoice[] = [];
  private payments: Payment[] = [];

  constructor() {
    const lines1 = [
      line('l1', 'ER consultation', 'Emergency', 1, 120),
      line('l2', 'IV fluids & supplies', 'Pharmacy', 1, 35),
      line('l3', 'CBC + Chemistry panel', 'Lab', 1, 55),
    ];
    const r1 = recalcInvoice(lines1, 0.05, 0, 0);
    this.invoices.push({
      id: 'inv-001',
      invoiceNumber: 'INV-2026-0001',
      patientId: 'pat-003',
      patientName: 'Sofia Martinez',
      issueDate: '2026-10-18',
      dueDate: '2026-10-25',
      status: 'Issued',
      lines: lines1,
      ...r1,
      department: 'Emergency',
      createdAt: '2026-10-18T12:00:00Z',
      updatedAt: '2026-10-18T12:00:00Z',
    });

    const lines2 = [
      line('l4', 'Cardiology consult', 'Consultation', 1, 150),
      line('l5', 'ECG', 'Procedure', 1, 40),
      line('l6', 'Ward bed (2 nights)', 'Room', 2, 90),
    ];
    const r2 = recalcInvoice(lines2, 0.05, 20, 100);
    this.invoices.push({
      id: 'inv-002',
      invoiceNumber: 'INV-2026-0002',
      patientId: 'pat-002',
      patientName: 'James Okello',
      issueDate: '2026-10-15',
      dueDate: '2026-10-22',
      status: deriveStatus({ ...r2, dueDate: '2026-10-22', status: 'Issued' }),
      lines: lines2,
      ...r2,
      department: 'Cardiology',
      notes: 'Partial insurance pending',
      createdAt: '2026-10-15T09:00:00Z',
      updatedAt: '2026-10-16T10:00:00Z',
    });
    this.payments.push({
      id: 'pay-001',
      invoiceId: 'inv-002',
      amount: 100,
      method: 'Card',
      paidAt: '2026-10-16T10:00:00Z',
      receivedBy: 'Cashier A',
    });

    const lines3 = [
      line('l7', 'OPD visit', 'Consultation', 1, 50),
      line('l8', 'Amoxicillin course', 'Pharmacy', 1, 12),
    ];
    const r3 = recalcInvoice(lines3, 0, 0, 62);
    this.invoices.push({
      id: 'inv-003',
      invoiceNumber: 'INV-2026-0003',
      patientId: 'pat-006',
      patientName: 'Lucas Berg',
      issueDate: '2026-10-19',
      dueDate: '2026-10-19',
      status: 'Paid',
      lines: lines3,
      ...r3,
      department: 'OPD',
      createdAt: '2026-10-19T14:00:00Z',
      updatedAt: '2026-10-19T14:15:00Z',
    });
  }

  listInvoices(status?: string, query?: string): Observable<Invoice[]> {
    let list = [...this.invoices];
    if (status && status !== 'ALL') {
      list = list.filter((i) => i.status === status);
    }
    if (query?.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (i) =>
          i.patientName.toLowerCase().includes(q) ||
          i.invoiceNumber.toLowerCase().includes(q) ||
          (i.department ?? '').toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => b.issueDate.localeCompare(a.issueDate));
    return of(list).pipe(delay(180));
  }

  listPayments(invoiceId?: string): Observable<Payment[]> {
    let list = [...this.payments];
    if (invoiceId) list = list.filter((p) => p.invoiceId === invoiceId);
    list.sort((a, b) => b.paidAt.localeCompare(a.paidAt));
    return of(list).pipe(delay(100));
  }

  revenue(): Observable<RevenueSnapshot> {
    const totalIssued = this.invoices
      .filter((i) => i.status !== 'Void' && i.status !== 'Draft')
      .reduce((s, i) => s + i.total, 0);
    const totalCollected = this.invoices.reduce((s, i) => s + i.amountPaid, 0);
    const outstanding = this.invoices
      .filter((i) => i.balance > 0 && i.status !== 'Void')
      .reduce((s, i) => s + i.balance, 0);
    const overdueCount = this.invoices.filter((i) => i.status === 'Overdue').length;
    const deptMap = new Map<string, number>();
    for (const inv of this.invoices) {
      if (inv.status === 'Void' || inv.status === 'Draft') continue;
      const d = inv.department || 'Other';
      deptMap.set(d, (deptMap.get(d) ?? 0) + inv.total);
    }
    const byDepartment = [...deptMap.entries()]
      .map(([department, amount]) => ({ department, amount }))
      .sort((a, b) => b.amount - a.amount);
    return of({
      totalIssued: Math.round(totalIssued * 100) / 100,
      totalCollected: Math.round(totalCollected * 100) / 100,
      outstanding: Math.round(outstanding * 100) / 100,
      overdueCount,
      byDepartment,
    }).pipe(delay(120));
  }

  createInvoice(input: {
    patientId: string;
    patientName: string;
    department: string;
    dueDays: number;
    lines: Omit<InvoiceLine, 'id' | 'amount'>[];
    discount?: number;
    notes?: string;
  }): Observable<Invoice> {
    const now = new Date();
    const issueDate = now.toISOString().slice(0, 10);
    const due = new Date(now.getTime() + input.dueDays * 86400000)
      .toISOString()
      .slice(0, 10);
    const lines: InvoiceLine[] = input.lines.map((l, i) =>
      line(`nl-${this.invSeq}-${i}`, l.description, l.category, l.quantity, l.unitPrice)
    );
    const amounts = recalcInvoice(lines, 0.05, input.discount ?? 0, 0);
    const inv: Invoice = {
      id: `inv-${String(this.invSeq).padStart(3, '0')}`,
      invoiceNumber: `INV-2026-${String(this.invSeq).padStart(4, '0')}`,
      patientId: input.patientId,
      patientName: input.patientName,
      issueDate,
      dueDate: due,
      status: 'Issued',
      lines,
      ...amounts,
      notes: input.notes,
      department: input.department,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    this.invSeq++;
    this.invoices = [inv, ...this.invoices];
    return of(inv).pipe(delay(320));
  }

  recordPayment(input: {
    invoiceId: string;
    amount: number;
    method: PaymentMethod;
    receivedBy: string;
    reference?: string;
  }): Observable<{ invoice: Invoice; payment: Payment }> {
    const idx = this.invoices.findIndex((i) => i.id === input.invoiceId);
    if (idx < 0) throw new Error('Invoice not found');
    const inv = this.invoices[idx];
    if (inv.status === 'Void' || inv.status === 'Paid') {
      throw new Error('Cannot pay this invoice');
    }
    const amount = Math.min(input.amount, inv.balance);
    if (amount <= 0) throw new Error('Invalid payment amount');

    const payment: Payment = {
      id: `pay-${String(this.paySeq++).padStart(3, '0')}`,
      invoiceId: inv.id,
      amount,
      method: input.method,
      reference: input.reference,
      paidAt: new Date().toISOString(),
      receivedBy: input.receivedBy,
    };
    this.payments = [payment, ...this.payments];

    const amountPaid = inv.amountPaid + amount;
    const balance = Math.round((inv.total - amountPaid) * 100) / 100;
    const status = deriveStatus({
      total: inv.total,
      amountPaid,
      balance,
      dueDate: inv.dueDate,
      status: inv.status,
    });
    const updated: Invoice = {
      ...inv,
      amountPaid,
      balance,
      status,
      updatedAt: new Date().toISOString(),
    };
    this.invoices = [
      ...this.invoices.slice(0, idx),
      updated,
      ...this.invoices.slice(idx + 1),
    ];
    return of({ invoice: updated, payment }).pipe(delay(280));
  }
}
