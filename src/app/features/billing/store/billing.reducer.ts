import { createReducer, on } from '@ngrx/store';
import { Invoice, RevenueSnapshot } from '../domain/billing.entity';
import { BillingActions } from './billing.actions';

export interface BillingState {
  invoices: Invoice[];
  revenue: RevenueSnapshot | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialBillingState: BillingState = {
  invoices: [],
  revenue: null,
  loading: false,
  saving: false,
  error: null,
};

export const billingReducer = createReducer(
  initialBillingState,

  on(BillingActions.load, (s) => ({ ...s, loading: true, error: null })),
  on(BillingActions.loadSuccess, (s, { invoices, revenue }) => ({
    ...s,
    invoices,
    revenue,
    loading: false,
  })),
  on(
    BillingActions.loadFailure,
    BillingActions.createInvoiceFailure,
    BillingActions.recordPaymentFailure,
    (s, { error }) => ({ ...s, loading: false, saving: false, error })
  ),

  on(BillingActions.createInvoice, BillingActions.recordPayment, (s) => ({
    ...s,
    saving: true,
    error: null,
  })),

  on(BillingActions.createInvoiceSuccess, (s, { invoice }) => ({
    ...s,
    saving: false,
    invoices: [invoice, ...s.invoices],
  })),

  on(BillingActions.recordPaymentSuccess, (s, { invoice }) => ({
    ...s,
    saving: false,
    invoices: s.invoices.map((i) => (i.id === invoice.id ? invoice : i)),
  })),

  on(BillingActions.clearError, (s) => ({ ...s, error: null }))
);
