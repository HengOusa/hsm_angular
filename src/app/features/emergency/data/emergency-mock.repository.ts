import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  EmergencyCase,
  EmergencySearchCriteria,
  TriageLevel,
  EmergencyCaseStatus,
  triageSortKey,
} from '../domain/emergency.entity';

@Injectable({ providedIn: 'root' })
export class EmergencyMockRepository {
  private seq = 4;
  private cases: EmergencyCase[] = [
    {
      id: 'er-001',
      caseNumber: 'ER-2026-0001',
      patientId: 'pat-003',
      patientName: 'Sofia Martinez',
      ageYears: 31,
      gender: 'Female',
      triageLevel: 'Urgent',
      chiefComplaint: 'Severe abdominal pain, onset 2h',
      arrivalMode: 'WalkIn',
      arrivalTime: new Date(Date.now() - 45 * 60000).toISOString(),
      triageTime: new Date(Date.now() - 40 * 60000).toISOString(),
      status: 'InProgress',
      assignedDoctor: 'Dr. Emily Wright',
      assignedRoom: 'ER-A2',
      teamMembers: ['Dr. Emily Wright', 'Nurse Omar'],
      interventions: ['IV access', 'Analgesia', 'Labs ordered'],
      createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
      updatedAt: new Date(Date.now() - 20 * 60000).toISOString(),
    },
    {
      id: 'er-002',
      caseNumber: 'ER-2026-0002',
      patientName: 'Unknown Male',
      ageYears: 55,
      gender: 'Male',
      triageLevel: 'Immediate',
      chiefComplaint: 'Unresponsive, possible cardiac arrest',
      arrivalMode: 'Ambulance',
      arrivalTime: new Date(Date.now() - 12 * 60000).toISOString(),
      triageTime: new Date(Date.now() - 11 * 60000).toISOString(),
      status: 'InProgress',
      assignedDoctor: 'Dr. Raj Patel',
      assignedRoom: 'Resus-1',
      teamMembers: ['Dr. Raj Patel', 'Dr. Sarah Chen', 'Trauma nurse'],
      interventions: ['CPR', 'Airway', 'Defib standby'],
      notes: 'Code team activated',
      createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    },
    {
      id: 'er-003',
      caseNumber: 'ER-2026-0003',
      patientName: 'Lina Farouk',
      ageYears: 8,
      gender: 'Female',
      triageLevel: 'LessUrgent',
      chiefComplaint: 'Fever and cough × 2 days',
      arrivalMode: 'WalkIn',
      arrivalTime: new Date(Date.now() - 90 * 60000).toISOString(),
      triageTime: new Date(Date.now() - 85 * 60000).toISOString(),
      status: 'Triaging',
      teamMembers: [],
      interventions: [],
      createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
      updatedAt: new Date(Date.now() - 85 * 60000).toISOString(),
    },
    {
      id: 'er-004',
      caseNumber: 'ER-2026-0004',
      patientName: 'Hassan Ali',
      ageYears: 42,
      gender: 'Male',
      triageLevel: 'NonUrgent',
      chiefComplaint: 'Minor laceration right hand',
      arrivalMode: 'WalkIn',
      arrivalTime: new Date(Date.now() - 120 * 60000).toISOString(),
      triageTime: new Date(Date.now() - 115 * 60000).toISOString(),
      doctorSeenTime: new Date(Date.now() - 60 * 60000).toISOString(),
      status: 'Discharged',
      assignedDoctor: 'Dr. Emily Wright',
      assignedRoom: 'ER-B1',
      teamMembers: ['Dr. Emily Wright'],
      interventions: ['Wound clean', 'Sutures × 4'],
      disposition: 'Home with wound care advice',
      dispositionTime: new Date(Date.now() - 30 * 60000).toISOString(),
      createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    },
  ];

  list(criteria: EmergencySearchCriteria = {}): Observable<EmergencyCase[]> {
    let list = [...this.cases];
    if (criteria.status === 'ACTIVE') {
      list = list.filter((c) =>
        ['Triaging', 'InProgress'].includes(c.status)
      );
    } else if (criteria.status && criteria.status !== 'ALL') {
      list = list.filter((c) => c.status === criteria.status);
    }
    if (criteria.triageLevel && criteria.triageLevel !== 'ALL') {
      list = list.filter((c) => c.triageLevel === criteria.triageLevel);
    }
    list.sort((a, b) => {
      const t = triageSortKey(a.triageLevel) - triageSortKey(b.triageLevel);
      if (t !== 0) return t;
      return a.arrivalTime.localeCompare(b.arrivalTime);
    });
    return of(list).pipe(delay(160));
  }

  create(
    input: Omit<
      EmergencyCase,
      'id' | 'caseNumber' | 'createdAt' | 'updatedAt' | 'teamMembers' | 'interventions'
    > & { teamMembers?: string[]; interventions?: string[] }
  ): Observable<EmergencyCase> {
    const now = new Date().toISOString();
    const item: EmergencyCase = {
      ...input,
      id: `er-${String(this.seq).padStart(3, '0')}`,
      caseNumber: `ER-2026-${String(this.seq).padStart(4, '0')}`,
      teamMembers: input.teamMembers ?? [],
      interventions: input.interventions ?? [],
      createdAt: now,
      updatedAt: now,
    };
    this.seq++;
    this.cases = [item, ...this.cases];
    return of(item).pipe(delay(300));
  }

  update(
    id: string,
    patch: Partial<EmergencyCase>
  ): Observable<EmergencyCase> {
    const idx = this.cases.findIndex((c) => c.id === id);
    if (idx < 0) throw new Error('Case not found');
    const updated: EmergencyCase = {
      ...this.cases[idx],
      ...patch,
      id,
      updatedAt: new Date().toISOString(),
    };
    this.cases = [...this.cases.slice(0, idx), updated, ...this.cases.slice(idx + 1)];
    return of(updated).pipe(delay(220));
  }

  activateTraumaTeam(id: string): Observable<EmergencyCase> {
    return this.update(id, {
      triageLevel: 'Immediate' as TriageLevel,
      status: 'InProgress' as EmergencyCaseStatus,
      assignedRoom: 'Resus-1',
      teamMembers: ['Trauma lead', 'Airway', 'Circulation', 'Scribe'],
      interventions: ['Trauma activation'],
      notes: 'Trauma team activated',
    });
  }
}
