import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { BillingActions } from './billing.actions';
import {
  selectInvoices,
  selectRevenue,
  selectBillingLoading,
  selectBillingSaving,
  selectBillingError,
} from './billing.selectors';
import { InvoiceLine, PaymentMethod } from '../domain/billing.entity';

@Injectable({ providedIn: 'root' })
export class BillingFacade {
  private readonly store = inject(Store);

  readonly invoices = this.store.selectSignal(selectInvoices);
  readonly revenue = this.store.selectSignal(selectRevenue);
  readonly loading = this.store.selectSignal(selectBillingLoading);
  readonly saving = this.store.selectSignal(selectBillingSaving);
  readonly error = this.store.selectSignal(selectBillingError);

  load(status?: string, query?: string): void {
    this.store.dispatch(BillingActions.load({ status, query }));
  }

  createInvoice(payload: {
    patientId: string;
    patientName: string;
    department: string;
    dueDays: number;
    lines: Omit<InvoiceLine, 'id' | 'amount'>[];
    discount?: number;
    notes?: string;
  }): void {
    this.store.dispatch(BillingActions.createInvoice(payload));
  }

  recordPayment(payload: {
    invoiceId: string;
    amount: number;
    method: PaymentMethod;
    receivedBy: string;
    reference?: string;
  }): void {
    this.store.dispatch(BillingActions.recordPayment(payload));
  }
}
