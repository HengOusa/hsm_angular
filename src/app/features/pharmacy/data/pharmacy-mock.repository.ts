import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  Drug,
  Prescription,
  PrescriptionStatus,
  findInteractions,
} from '../domain/pharmacy.entity';

const DRUGS: Drug[] = [
  {
    id: 'drug-amox',
    code: 'AMX-500',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    category: 'Antibiotic',
    strength: '500 mg',
    form: 'Capsule',
    stockQty: 240,
    reorderLevel: 50,
    unitPrice: 0.35,
    expiryDate: '2027-06-30',
    controlled: false,
  },
  {
    id: 'drug-paracetamol',
    code: 'PCM-500',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    category: 'Analgesic',
    strength: '500 mg',
    form: 'Tablet',
    stockQty: 18,
    reorderLevel: 100,
    unitPrice: 0.08,
    expiryDate: '2026-12-01',
    controlled: false,
  },
  {
    id: 'drug-warfarin',
    code: 'WRF-5',
    name: 'Warfarin',
    genericName: 'Warfarin sodium',
    category: 'Cardiovascular',
    strength: '5 mg',
    form: 'Tablet',
    stockQty: 90,
    reorderLevel: 30,
    unitPrice: 0.22,
    expiryDate: '2027-03-15',
    controlled: true,
  },
  {
    id: 'drug-aspirin',
    code: 'ASA-81',
    name: 'Aspirin',
    genericName: 'Acetylsalicylic acid',
    category: 'Cardiovascular',
    strength: '81 mg',
    form: 'Tablet',
    stockQty: 400,
    reorderLevel: 80,
    unitPrice: 0.05,
    expiryDate: '2028-01-20',
    controlled: false,
  },
  {
    id: 'drug-metformin',
    code: 'MET-500',
    name: 'Metformin',
    genericName: 'Metformin HCl',
    category: 'Antidiabetic',
    strength: '500 mg',
    form: 'Tablet',
    stockQty: 320,
    reorderLevel: 60,
    unitPrice: 0.12,
    expiryDate: '2027-09-01',
    controlled: false,
  },
  {
    id: 'drug-lisinopril',
    code: 'LIS-10',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    category: 'Cardiovascular',
    strength: '10 mg',
    form: 'Tablet',
    stockQty: 45,
    reorderLevel: 40,
    unitPrice: 0.18,
    expiryDate: '2027-04-10',
    controlled: false,
  },
  {
    id: 'drug-spironolactone',
    code: 'SPI-25',
    name: 'Spironolactone',
    genericName: 'Spironolactone',
    category: 'Cardiovascular',
    strength: '25 mg',
    form: 'Tablet',
    stockQty: 110,
    reorderLevel: 25,
    unitPrice: 0.15,
    expiryDate: '2027-11-30',
    controlled: false,
  },
  {
    id: 'drug-salbutamol',
    code: 'SAL-INH',
    name: 'Salbutamol inhaler',
    genericName: 'Albuterol',
    category: 'Respiratory',
    strength: '100 mcg/puff',
    form: 'Inhaler',
    stockQty: 12,
    reorderLevel: 20,
    unitPrice: 4.5,
    expiryDate: '2026-11-15',
    controlled: false,
  },
];

@Injectable({ providedIn: 'root' })
export class PharmacyMockRepository {
  private drugs = [...DRUGS];
  private prescriptions: Prescription[] = [
    {
      id: 'rx-001',
      prescriptionNumber: 'RX-2026-0001',
      patientId: 'pat-002',
      patientName: 'James Okello',
      doctorId: 'doc-001',
      doctorName: 'Dr. Sarah Chen',
      status: 'Pending',
      medications: [
        {
          drugId: 'drug-lisinopril',
          drugName: 'Lisinopril 10 mg',
          dosage: '10 mg',
          route: 'PO',
          frequency: 'Once daily',
          duration: '30 days',
          quantity: 30,
          isGenericAllowed: true,
        },
        {
          drugId: 'drug-aspirin',
          drugName: 'Aspirin 81 mg',
          dosage: '81 mg',
          route: 'PO',
          frequency: 'Once daily',
          duration: '30 days',
          quantity: 30,
          isGenericAllowed: true,
        },
      ],
      interactionWarnings: [],
      createdAt: '2026-10-20T08:00:00Z',
    },
    {
      id: 'rx-002',
      prescriptionNumber: 'RX-2026-0002',
      patientId: 'pat-001',
      patientName: 'Amina Hassan',
      doctorId: 'doc-002',
      doctorName: 'Dr. Raj Patel',
      status: 'Pending',
      medications: [
        {
          drugId: 'drug-warfarin',
          drugName: 'Warfarin 5 mg',
          dosage: '5 mg',
          route: 'PO',
          frequency: 'Once daily',
          duration: '14 days',
          quantity: 14,
          isGenericAllowed: false,
          instructions: 'Take at same time each evening',
        },
        {
          drugId: 'drug-aspirin',
          drugName: 'Aspirin 81 mg',
          dosage: '81 mg',
          route: 'PO',
          frequency: 'Once daily',
          duration: '14 days',
          quantity: 14,
          isGenericAllowed: true,
        },
      ],
      interactionWarnings: findInteractions(['drug-warfarin', 'drug-aspirin']),
      createdAt: '2026-10-20T09:15:00Z',
    },
    {
      id: 'rx-003',
      prescriptionNumber: 'RX-2026-0003',
      patientId: 'pat-006',
      patientName: 'Lucas Berg',
      doctorId: 'doc-001',
      doctorName: 'Dr. Sarah Chen',
      status: 'Dispensed',
      medications: [
        {
          drugId: 'drug-salbutamol',
          drugName: 'Salbutamol inhaler',
          dosage: '1–2 puffs',
          route: 'Inhalation',
          frequency: 'PRN',
          duration: '1 inhaler',
          quantity: 1,
          isGenericAllowed: true,
        },
      ],
      interactionWarnings: [],
      createdAt: '2026-10-19T14:00:00Z',
      dispensedAt: '2026-10-19T15:30:00Z',
      dispensedBy: 'Pharmacist Lee',
    },
  ];

  listDrugs(query?: string, lowStockOnly?: boolean): Observable<Drug[]> {
    let list = [...this.drugs];
    if (query?.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.genericName.toLowerCase().includes(q) ||
          d.code.toLowerCase().includes(q)
      );
    }
    if (lowStockOnly) {
      list = list.filter((d) => d.stockQty <= d.reorderLevel);
    }
    list.sort((a, b) => a.name.localeCompare(b.name));
    return of(list).pipe(delay(160));
  }

  listPrescriptions(status?: PrescriptionStatus | 'ALL'): Observable<Prescription[]> {
    let list = [...this.prescriptions];
    if (status && status !== 'ALL') {
      list = list.filter((p) => p.status === status);
    }
    list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return of(list).pipe(delay(200));
  }

  dispense(id: string, dispensedBy: string): Observable<Prescription> {
    const idx = this.prescriptions.findIndex((p) => p.id === id);
    if (idx < 0) throw new Error('Prescription not found');
    const rx = this.prescriptions[idx];
    if (rx.status === 'Dispensed') throw new Error('Already dispensed');

    // Deduct stock
    for (const med of rx.medications) {
      const dIdx = this.drugs.findIndex((d) => d.id === med.drugId);
      if (dIdx >= 0) {
        const drug = this.drugs[dIdx];
        if (drug.stockQty < med.quantity) {
          throw new Error(`Insufficient stock for ${drug.name}`);
        }
        this.drugs[dIdx] = { ...drug, stockQty: drug.stockQty - med.quantity };
      }
    }

    const updated: Prescription = {
      ...rx,
      status: 'Dispensed',
      dispensedAt: new Date().toISOString(),
      dispensedBy,
    };
    this.prescriptions = [
      ...this.prescriptions.slice(0, idx),
      updated,
      ...this.prescriptions.slice(idx + 1),
    ];
    return of(updated).pipe(delay(400));
  }

  cancel(id: string): Observable<Prescription> {
    const idx = this.prescriptions.findIndex((p) => p.id === id);
    if (idx < 0) throw new Error('Prescription not found');
    const updated: Prescription = {
      ...this.prescriptions[idx],
      status: 'Cancelled',
    };
    this.prescriptions = [
      ...this.prescriptions.slice(0, idx),
      updated,
      ...this.prescriptions.slice(idx + 1),
    ];
    return of(updated).pipe(delay(200));
  }
}
