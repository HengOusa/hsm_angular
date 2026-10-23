import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  LabTest,
  LabTestCatalogItem,
  LabTestStatus,
  LabSearchCriteria,
  evaluateResult,
} from '../domain/lab.entity';

export const LAB_CATALOG: LabTestCatalogItem[] = [
  {
    code: 'CBC',
    name: 'Complete Blood Count',
    category: 'Hematology',
    sampleType: 'Whole blood EDTA',
    unit: '×10⁹/L',
    referenceRange: '4.0-11.0',
    criticalLow: 2.0,
    criticalHigh: 30.0,
  },
  {
    code: 'HGB',
    name: 'Hemoglobin',
    category: 'Hematology',
    sampleType: 'Whole blood EDTA',
    unit: 'g/dL',
    referenceRange: '12.0-16.0',
    criticalLow: 7.0,
    criticalHigh: 20.0,
  },
  {
    code: 'K',
    name: 'Potassium',
    category: 'Chemistry',
    sampleType: 'Serum',
    unit: 'mmol/L',
    referenceRange: '3.5-5.0',
    criticalLow: 2.5,
    criticalHigh: 6.0,
  },
  {
    code: 'NA',
    name: 'Sodium',
    category: 'Chemistry',
    sampleType: 'Serum',
    unit: 'mmol/L',
    referenceRange: '136-145',
    criticalLow: 120,
    criticalHigh: 160,
  },
  {
    code: 'GLU',
    name: 'Glucose (random)',
    category: 'Chemistry',
    sampleType: 'Serum',
    unit: 'mg/dL',
    referenceRange: '70-140',
    criticalLow: 40,
    criticalHigh: 400,
  },
  {
    code: 'CRP',
    name: 'C-Reactive Protein',
    category: 'Immunology',
    sampleType: 'Serum',
    unit: 'mg/L',
    referenceRange: '0-5',
    criticalHigh: 100,
  },
  {
    code: 'BCULT',
    name: 'Blood Culture',
    category: 'Microbiology',
    sampleType: 'Blood culture bottle',
  },
];

@Injectable({ providedIn: 'root' })
export class LabMockRepository {
  private seq = 4;
  private tests: LabTest[] = [
    {
      id: 'lab-001',
      orderId: 'ORD-2026-001',
      patientId: 'pat-002',
      patientName: 'James Okello',
      orderedBy: 'doc-001',
      orderedByName: 'Dr. Sarah Chen',
      testCode: 'K',
      testName: 'Potassium',
      category: 'Chemistry',
      sampleType: 'Serum',
      sampleCollectedAt: '2026-10-20T07:30:00Z',
      status: 'Processing',
      unit: 'mmol/L',
      referenceRange: '3.5-5.0',
      isCritical: false,
      isAbnormal: false,
      createdAt: '2026-10-20T07:00:00Z',
      updatedAt: '2026-10-20T07:45:00Z',
    },
    {
      id: 'lab-002',
      orderId: 'ORD-2026-001',
      patientId: 'pat-002',
      patientName: 'James Okello',
      orderedBy: 'doc-001',
      orderedByName: 'Dr. Sarah Chen',
      testCode: 'HGB',
      testName: 'Hemoglobin',
      category: 'Hematology',
      sampleType: 'Whole blood EDTA',
      status: 'Ordered',
      unit: 'g/dL',
      referenceRange: '12.0-16.0',
      isCritical: false,
      isAbnormal: false,
      createdAt: '2026-10-20T07:00:00Z',
      updatedAt: '2026-10-20T07:00:00Z',
    },
    {
      id: 'lab-003',
      orderId: 'ORD-2026-002',
      patientId: 'pat-001',
      patientName: 'Amina Hassan',
      orderedBy: 'doc-002',
      orderedByName: 'Dr. Raj Patel',
      testCode: 'GLU',
      testName: 'Glucose (random)',
      category: 'Chemistry',
      sampleType: 'Serum',
      sampleCollectedAt: '2026-10-19T18:00:00Z',
      status: 'Reported',
      result: '92',
      numericResult: 92,
      unit: 'mg/dL',
      referenceRange: '70-140',
      isCritical: false,
      isAbnormal: false,
      reportedBy: 'Lab Tech Kim',
      reportedAt: '2026-10-19T19:20:00Z',
      createdAt: '2026-10-19T17:30:00Z',
      updatedAt: '2026-10-19T19:20:00Z',
    },
  ];

  list(criteria: LabSearchCriteria = {}): Observable<LabTest[]> {
    let list = [...this.tests];
    if (criteria.status && criteria.status !== 'ALL') {
      list = list.filter((t) => t.status === criteria.status);
    }
    if (criteria.criticalOnly) {
      list = list.filter((t) => t.isCritical);
    }
    if (criteria.query?.trim()) {
      const q = criteria.query.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.patientName.toLowerCase().includes(q) ||
          t.testName.toLowerCase().includes(q) ||
          t.testCode.toLowerCase().includes(q) ||
          t.orderId.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return of(list).pipe(delay(180));
  }

  catalog(): Observable<LabTestCatalogItem[]> {
    return of([...LAB_CATALOG]).pipe(delay(50));
  }

  createOrder(input: {
    patientId: string;
    patientName: string;
    orderedBy: string;
    orderedByName: string;
    testCodes: string[];
  }): Observable<LabTest[]> {
    const orderId = `ORD-2026-${String(this.seq).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const created: LabTest[] = [];
    for (const code of input.testCodes) {
      const cat = LAB_CATALOG.find((c) => c.code === code);
      if (!cat) continue;
      const test: LabTest = {
        id: `lab-${String(this.seq++).padStart(3, '0')}`,
        orderId,
        patientId: input.patientId,
        patientName: input.patientName,
        orderedBy: input.orderedBy,
        orderedByName: input.orderedByName,
        testCode: cat.code,
        testName: cat.name,
        category: cat.category,
        sampleType: cat.sampleType,
        status: 'Ordered',
        unit: cat.unit,
        referenceRange: cat.referenceRange,
        isCritical: false,
        isAbnormal: false,
        createdAt: now,
        updatedAt: now,
      };
      created.push(test);
    }
    this.tests = [...created, ...this.tests];
    return of(created).pipe(delay(350));
  }

  updateStatus(id: string, status: LabTestStatus): Observable<LabTest> {
    const idx = this.tests.findIndex((t) => t.id === id);
    if (idx < 0) throw new Error('Test not found');
    const now = new Date().toISOString();
    const current = this.tests[idx];
    const updated: LabTest = {
      ...current,
      status,
      updatedAt: now,
      sampleCollectedAt:
        status === 'SampleCollected' || status === 'Processing' || status === 'Completed' || status === 'Reported'
          ? current.sampleCollectedAt ?? now
          : current.sampleCollectedAt,
    };
    this.tests = [...this.tests.slice(0, idx), updated, ...this.tests.slice(idx + 1)];
    return of(updated).pipe(delay(220));
  }

  enterResult(
    id: string,
    payload: { result: string; numericResult?: number; reportedBy: string; notes?: string }
  ): Observable<LabTest> {
    const idx = this.tests.findIndex((t) => t.id === id);
    if (idx < 0) throw new Error('Test not found');
    const current = this.tests[idx];
    const cat = LAB_CATALOG.find((c) => c.code === current.testCode);
    const flags = cat
      ? evaluateResult(payload.numericResult, cat)
      : { isAbnormal: false, isCritical: false };
    const now = new Date().toISOString();
    const updated: LabTest = {
      ...current,
      result: payload.result,
      numericResult: payload.numericResult,
      isAbnormal: flags.isAbnormal,
      isCritical: flags.isCritical,
      status: 'Reported',
      reportedBy: payload.reportedBy,
      reportedAt: now,
      notes: payload.notes,
      updatedAt: now,
    };
    this.tests = [...this.tests.slice(0, idx), updated, ...this.tests.slice(idx + 1)];
    return of(updated).pipe(delay(300));
  }
}
