import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  SoapNote,
  VitalSigns,
  Icd10Code,
  computeBmi,
  detectAbnormalVitals,
} from '../domain/emr.entity';

const ICD10: Icd10Code[] = [
  { code: 'J06.9', description: 'Acute upper respiratory infection, unspecified' },
  { code: 'I10', description: 'Essential (primary) hypertension' },
  { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
  { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
  { code: 'R50.9', description: 'Fever, unspecified' },
  { code: 'R51.9', description: 'Headache, unspecified' },
  { code: 'M54.5', description: 'Low back pain' },
  { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
  { code: 'N39.0', description: 'Urinary tract infection, site not specified' },
  { code: 'K21.0', description: 'Gastro-esophageal reflux disease with esophagitis' },
  { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
  { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery' },
];

@Injectable({ providedIn: 'root' })
export class EmrMockRepository {
  private notes: SoapNote[] = [
    {
      id: 'soap-001',
      patientId: 'pat-002',
      patientName: 'James Okello',
      authorId: 'usr-001',
      authorName: 'Dr. Sarah Chen',
      visitDate: '2026-10-19',
      subjective: 'Reports chest discomfort on mild exertion for 3 days. No syncope.',
      objective: 'BP 148/92, HR 88, SpO₂ 97% RA. Mild bilateral basal crackles.',
      assessment: 'Hypertensive urgency; rule out ACS.',
      plan: 'ECG, troponin, continue antihypertensives, cardiology follow-up.',
      diagnoses: [
        { code: 'I10', description: 'Essential (primary) hypertension' },
        { code: 'R07.9', description: 'Chest pain, unspecified' },
      ],
      createdAt: '2026-10-19T10:30:00Z',
      updatedAt: '2026-10-19T10:30:00Z',
    },
  ];

  private vitals: VitalSigns[] = [
    {
      id: 'vit-001',
      patientId: 'pat-002',
      recordedBy: 'Nurse Aya',
      recordedAt: '2026-10-19T09:45:00Z',
      bloodPressureSystolic: 148,
      bloodPressureDiastolic: 92,
      heartRate: 88,
      temperature: 36.8,
      spo2: 97,
      respiratoryRate: 18,
      pain: 3,
      isAbnormal: true,
      abnormalFlags: ['BP systolic', 'BP diastolic'],
    },
    {
      id: 'vit-002',
      patientId: 'pat-001',
      recordedBy: 'Nurse Aya',
      recordedAt: '2026-10-20T07:00:00Z',
      bloodPressureSystolic: 118,
      bloodPressureDiastolic: 76,
      heartRate: 72,
      temperature: 37.1,
      spo2: 99,
      respiratoryRate: 16,
      pain: 1,
      isAbnormal: false,
      abnormalFlags: [],
    },
  ];

  private noteSeq = 2;
  private vitSeq = 3;

  listNotes(patientId?: string): Observable<SoapNote[]> {
    let list = [...this.notes];
    if (patientId) list = list.filter((n) => n.patientId === patientId);
    list.sort((a, b) => b.visitDate.localeCompare(a.visitDate));
    return of(list).pipe(delay(200));
  }

  saveNote(
    input: Omit<SoapNote, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<SoapNote> {
    const now = new Date().toISOString();
    const note: SoapNote = {
      ...input,
      id: `soap-${String(this.noteSeq++).padStart(3, '0')}`,
      createdAt: now,
      updatedAt: now,
    };
    this.notes = [note, ...this.notes];
    return of(note).pipe(delay(350));
  }

  listVitals(patientId?: string): Observable<VitalSigns[]> {
    let list = [...this.vitals];
    if (patientId) list = list.filter((v) => v.patientId === patientId);
    list.sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
    return of(list).pipe(delay(180));
  }

  saveVitals(
    input: Omit<VitalSigns, 'id' | 'bmi' | 'isAbnormal' | 'abnormalFlags'>
  ): Observable<VitalSigns> {
    const bmi = computeBmi(input.weight, input.height);
    const abnormalFlags = detectAbnormalVitals(input);
    const record: VitalSigns = {
      ...input,
      id: `vit-${String(this.vitSeq++).padStart(3, '0')}`,
      bmi,
      isAbnormal: abnormalFlags.length > 0,
      abnormalFlags,
    };
    this.vitals = [record, ...this.vitals];
    return of(record).pipe(delay(300));
  }

  searchIcd10(query: string): Observable<Icd10Code[]> {
    const q = query.trim().toLowerCase();
    if (!q) return of(ICD10.slice(0, 8)).pipe(delay(80));
    const hits = ICD10.filter(
      (c) =>
        c.code.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
    return of(hits).pipe(delay(120));
  }
}
