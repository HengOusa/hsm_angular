import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Invoice, Payment, PaymentMethod, RevenueSnapshot, InvoiceLine } from '../domain/billing.entity';

export const BillingActions = createActionGroup({
  source: 'Billing',
  events: {
    'Load': props<{ status?: string; query?: string }>(),
    'Load Success': props<{ invoices: Invoice[]; revenue: RevenueSnapshot }>(),
    'Load Failure': props<{ error: string }>(),

    'Create Invoice': props<{
      patientId: string;
      patientName: string;
      department: string;
      dueDays: number;
      lines: Omit<InvoiceLine, 'id' | 'amount'>[];
      discount?: number;
      notes?: string;
    }>(),
    'Create Invoice Success': props<{ invoice: Invoice }>(),
    'Create Invoice Failure': props<{ error: string }>(),

    'Record Payment': props<{
      invoiceId: string;
      amount: number;
      method: PaymentMethod;
      receivedBy: string;
      reference?: string;
    }>(),
    'Record Payment Success': props<{ invoice: Invoice; payment: Payment }>(),
    'Record Payment Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
  },
});
