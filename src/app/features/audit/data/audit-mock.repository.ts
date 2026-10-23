import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { AuditEntry, AuditAction } from '../domain/audit.entity';

@Injectable({ providedIn: 'root' })
export class AuditMockRepository {
  private entries: AuditEntry[] = [
    {
      id: 'aud-001',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      userId: 'usr-001',
      userName: 'Dr. Sarah Chen',
      action: 'REPORT',
      resource: 'LabResult',
      resourceId: 'lab-001',
      details: 'Critical K+ reported for James Okello',
      ip: '10.0.1.12',
    },
    {
      id: 'aud-002',
      timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
      userId: 'usr-002',
      userName: 'Nurse Aya',
      action: 'STATUS_CHANGE',
      resource: 'Bed',
      resourceId: 'bed-icu-03',
      details: 'ICU-03 → Cleaning',
      ip: '10.0.1.45',
    },
    {
      id: 'aud-003',
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      userId: 'usr-003',
      userName: 'Pharmacist Lee',
      action: 'DISPENSE',
      resource: 'Prescription',
      resourceId: 'rx-003',
      details: 'Dispensed RX-2026-0003 · Lucas Berg',
      ip: '10.0.2.8',
    },
    {
      id: 'aud-004',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      userId: 'usr-001',
      userName: 'Dr. Sarah Chen',
      action: 'CREATE',
      resource: 'SoapNote',
      resourceId: 'soap-001',
      details: 'SOAP note for James Okello',
      ip: '10.0.1.12',
    },
    {
      id: 'aud-005',
      timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
      userId: 'usr-004',
      userName: 'Cashier A',
      action: 'PAYMENT',
      resource: 'Invoice',
      resourceId: 'inv-002',
      details: 'Partial payment $100 · Card',
      ip: '10.0.3.2',
    },
    {
      id: 'aud-006',
      timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
      userId: 'usr-001',
      userName: 'Dr. Sarah Chen',
      action: 'LOGIN',
      resource: 'Session',
      details: 'Successful login',
      ip: '10.0.1.12',
    },
    {
      id: 'aud-007',
      timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
      userId: 'usr-005',
      userName: 'Dr. Raj Patel',
      action: 'STATUS_CHANGE',
      resource: 'EmergencyCase',
      resourceId: 'er-002',
      details: 'Trauma team activated · Resus-1',
      ip: '10.0.1.20',
    },
    {
      id: 'aud-008',
      timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
      userId: 'usr-006',
      userName: 'Receptionist Nora',
      action: 'CREATE',
      resource: 'Patient',
      resourceId: 'pat-006',
      details: 'Registered Lucas Berg',
      ip: '10.0.1.30',
    },
  ];

  list(action?: AuditAction | 'ALL', query?: string): Observable<AuditEntry[]> {
    let list = [...this.entries];
    if (action && action !== 'ALL') {
      list = list.filter((e) => e.action === action);
    }
    if (query?.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.userName.toLowerCase().includes(q) ||
          e.resource.toLowerCase().includes(q) ||
          e.details.toLowerCase().includes(q) ||
          (e.resourceId ?? '').toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    return of(list).pipe(delay(150));
  }
}
