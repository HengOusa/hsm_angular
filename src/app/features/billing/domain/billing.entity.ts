export type InvoiceStatus = 'Draft' | 'Issued' | 'PartiallyPaid' | 'Paid' | 'Void' | 'Overdue';
export type PaymentMethod = 'Cash' | 'Card' | 'Insurance' | 'BankTransfer' | 'Other';
export type ChargeCategory =
  | 'Consultation'
  | 'Procedure'
  | 'Lab'
  | 'Pharmacy'
  | 'Room'
  | 'Emergency'
  | 'Other';

export interface InvoiceLine {
  id: string;
  description: string;
  category: ChargeCategory;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  paidAt: string;
  receivedBy: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  lines: InvoiceLine[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  balance: number;
  notes?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RevenueSnapshot {
  totalIssued: number;
  totalCollected: number;
  outstanding: number;
  overdueCount: number;
  byDepartment: { department: string; amount: number }[];
}

export function recalcInvoice(
  lines: InvoiceLine[],
  taxRate = 0,
  discount = 0,
  amountPaid = 0
): Pick<Invoice, 'subtotal' | 'tax' | 'discount' | 'total' | 'amountPaid' | 'balance'> {
  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.max(0, Math.round((subtotal + tax - discount) * 100) / 100);
  const paid = Math.min(amountPaid, total);
  const balance = Math.round((total - paid) * 100) / 100;
  return { subtotal, tax, discount, total, amountPaid: paid, balance };
}

export function deriveStatus(inv: Pick<Invoice, 'total' | 'amountPaid' | 'balance' | 'dueDate' | 'status'>): InvoiceStatus {
  if (inv.status === 'Void' || inv.status === 'Draft') return inv.status;
  if (inv.balance <= 0 && inv.total > 0) return 'Paid';
  if (inv.amountPaid > 0 && inv.balance > 0) {
    if (new Date(inv.dueDate) < new Date() && inv.balance > 0) return 'Overdue';
    return 'PartiallyPaid';
  }
  if (new Date(inv.dueDate) < new Date() && inv.balance > 0) return 'Overdue';
  return 'Issued';
}
