import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { PatientRepository, PatientListResult } from '../domain/patient.repository';
import { Patient, PatientSearchCriteria } from '../domain/patient.entity';

const SEED: Patient[] = [
  {
    id: 'pat-001',
    mrn: 'MRN-2026-0001',
    firstName: 'Amina',
    lastName: 'Hassan',
    dateOfBirth: '1988-03-14',
    gender: 'Female',
    bloodGroup: 'O+',
    allergies: ['Penicillin'],
    chronicConditions: ['Hypertension'],
    phone: '+971501234567',
    email: 'amina.h@example.com',
    address: 'Dubai Marina, Dubai',
    emergencyContact: { name: 'Omar Hassan', relation: 'Spouse', phone: '+971509876543' },
    insurance: { provider: 'Daman', policyNumber: 'DM-99821', validity: '2027-12-31' },
    status: 'IPD',
    admissionDate: '2026-10-18T08:30:00Z',
    bedId: 'bed-icu-04',
    wardId: 'ward-icu',
    attendingDoctorId: 'doc-001',
    createdAt: '2026-10-18T08:00:00Z',
    updatedAt: '2026-10-19T14:00:00Z',
  },
  {
    id: 'pat-002',
    mrn: 'MRN-2026-0002',
    firstName: 'James',
    lastName: 'Okello',
    dateOfBirth: '1975-11-02',
    gender: 'Male',
    bloodGroup: 'A+',
    allergies: [],
    chronicConditions: ['Type 2 Diabetes'],
    phone: '+971502222333',
    email: 'j.okello@example.com',
    status: 'OPD',
    attendingDoctorId: 'doc-002',
    createdAt: '2026-10-15T09:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'pat-003',
    mrn: 'MRN-2026-0003',
    firstName: 'Sofia',
    lastName: 'Martinez',
    dateOfBirth: '1995-07-22',
    gender: 'Female',
    bloodGroup: 'B-',
    allergies: ['Latex', 'Sulfa'],
    chronicConditions: [],
    phone: '+971503333444',
    status: 'ER',
    admissionDate: '2026-10-20T06:15:00Z',
    attendingDoctorId: 'doc-001',
    createdAt: '2026-10-20T06:15:00Z',
    updatedAt: '2026-10-20T06:15:00Z',
  },
  {
    id: 'pat-004',
    mrn: 'MRN-2026-0004',
    firstName: 'Wei',
    lastName: 'Chen',
    dateOfBirth: '1962-01-30',
    gender: 'Male',
    bloodGroup: 'AB+',
    allergies: ['Aspirin'],
    chronicConditions: ['COPD', 'CAD'],
    phone: '+971504444555',
    status: 'ICU',
    admissionDate: '2026-10-17T22:00:00Z',
    bedId: 'bed-icu-01',
    wardId: 'ward-icu',
    attendingDoctorId: 'doc-003',
    createdAt: '2026-10-17T22:00:00Z',
    updatedAt: '2026-10-19T08:00:00Z',
  },
  {
    id: 'pat-005',
    mrn: 'MRN-2026-0005',
    firstName: 'Fatima',
    lastName: 'Al-Rashid',
    dateOfBirth: '2019-05-08',
    gender: 'Female',
    bloodGroup: 'O-',
    allergies: [],
    chronicConditions: [],
    phone: '+971505555666',
    status: 'Discharged',
    admissionDate: '2026-10-10T10:00:00Z',
    dischargeDate: '2026-10-12T16:00:00Z',
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-10-12T16:00:00Z',
  },
  {
    id: 'pat-006',
    mrn: 'MRN-2026-0006',
    firstName: 'Lucas',
    lastName: 'Berg',
    dateOfBirth: '1990-09-19',
    gender: 'Male',
    bloodGroup: 'A-',
    allergies: ['Iodine contrast'],
    chronicConditions: ['Asthma'],
    phone: '+971506666777',
    email: 'lucas.berg@example.com',
    status: 'OPD',
    createdAt: '2026-10-19T11:30:00Z',
    updatedAt: '2026-10-19T11:30:00Z',
  },
];

@Injectable({ providedIn: 'root' })
export class PatientMockRepository extends PatientRepository {
  private patients = [...SEED];
  private seq = 7;

  search(criteria: PatientSearchCriteria): Observable<PatientListResult> {
    const q = (criteria.query ?? '').trim().toLowerCase();
    const status = criteria.status ?? 'ALL';
    const page = criteria.page ?? 0;
    const pageSize = criteria.pageSize ?? 10;

    let filtered = this.patients;
    if (q) {
      filtered = filtered.filter(
        (p) =>
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          p.mrn.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          (p.email?.toLowerCase().includes(q) ?? false)
      );
    }
    if (status !== 'ALL') {
      filtered = filtered.filter((p) => p.status === status);
    }

    // Newest first
    filtered = [...filtered].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    const total = filtered.length;
    const start = page * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return of({ items, total, page, pageSize }).pipe(delay(280));
  }

  getById(id: string): Observable<Patient | null> {
    const p = this.patients.find((x) => x.id === id) ?? null;
    return of(p).pipe(delay(150));
  }

  create(
    input: Omit<Patient, 'id' | 'mrn' | 'createdAt' | 'updatedAt'>
  ): Observable<Patient> {
    const now = new Date().toISOString();
    const patient: Patient = {
      ...input,
      id: `pat-${String(this.seq).padStart(3, '0')}`,
      mrn: `MRN-2026-${String(this.seq).padStart(4, '0')}`,
      createdAt: now,
      updatedAt: now,
    };
    this.seq++;
    this.patients = [patient, ...this.patients];
    return of(patient).pipe(delay(400));
  }

  update(id: string, patch: Partial<Patient>): Observable<Patient> {
    const idx = this.patients.findIndex((p) => p.id === id);
    if (idx < 0) {
      throw new Error('Patient not found');
    }
    const updated: Patient = {
      ...this.patients[idx],
      ...patch,
      id,
      updatedAt: new Date().toISOString(),
    };
    this.patients = [
      ...this.patients.slice(0, idx),
      updated,
      ...this.patients.slice(idx + 1),
    ];
    return of(updated).pipe(delay(300));
  }

  delete(id: string): Observable<void> {
    this.patients = this.patients.filter((p) => p.id !== id);
    return of(undefined).pipe(delay(200));
  }
}
