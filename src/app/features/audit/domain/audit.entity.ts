export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'VIEW'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'DISPENSE'
  | 'REPORT'
  | 'PAYMENT'
  | 'STATUS_CHANGE';

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details: string;
  ip?: string;
}
