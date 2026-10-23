import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Bed, BedSearchCriteria, BedStatus, WardSummary } from '../domain/bed.entity';

function bed(
  id: string,
  bedNumber: string,
  wardId: string,
  wardName: string,
  floor: number,
  room: string,
  type: Bed['type'],
  status: BedStatus,
  features: Bed['features'],
  patient?: { id: string; name: string; since: string }
): Bed {
  return {
    id,
    bedNumber,
    wardId,
    wardName,
    floor,
    room,
    type,
    status,
    features,
    currentPatientId: patient?.id,
    currentPatientName: patient?.name,
    admissionDate: patient?.since,
  };
}

const feat = (o = false, s = false, m = false, v = false) => ({
  oxygen: o,
  suction: s,
  monitor: m,
  ventilator: v,
});

const SEED: Bed[] = [
  // ICU
  bed('bed-icu-01', 'ICU-01', 'ward-icu', 'ICU', 3, '301', 'ICU', 'Occupied', feat(true, true, true, true), {
    id: 'pat-004',
    name: 'Wei Chen',
    since: '2026-10-17T22:00:00Z',
  }),
  bed('bed-icu-02', 'ICU-02', 'ward-icu', 'ICU', 3, '301', 'ICU', 'Available', feat(true, true, true, true)),
  bed('bed-icu-03', 'ICU-03', 'ward-icu', 'ICU', 3, '302', 'ICU', 'Cleaning', feat(true, true, true, false)),
  bed('bed-icu-04', 'ICU-04', 'ward-icu', 'ICU', 3, '303', 'ICU', 'Occupied', feat(true, true, true, true), {
    id: 'pat-001',
    name: 'Amina Hassan',
    since: '2026-10-18T08:30:00Z',
  }),
  bed('bed-icu-05', 'ICU-05', 'ward-icu', 'ICU', 3, '303', 'ICU', 'Reserved', feat(true, true, true, true)),
  bed('bed-icu-06', 'ICU-06', 'ward-icu', 'ICU', 3, '304', 'ICU', 'Maintenance', feat(true, true, true, true)),
  // General Ward A
  bed('bed-ga-01', 'GA-01', 'ward-general-a', 'General A', 2, '201', 'General', 'Occupied', feat(true, false, false, false), {
    id: 'pat-x1',
    name: 'Nora Ali',
    since: '2026-10-19T10:00:00Z',
  }),
  bed('bed-ga-02', 'GA-02', 'ward-general-a', 'General A', 2, '201', 'General', 'Available', feat(true, false, false, false)),
  bed('bed-ga-03', 'GA-03', 'ward-general-a', 'General A', 2, '202', 'General', 'Available', feat(true, true, false, false)),
  bed('bed-ga-04', 'GA-04', 'ward-general-a', 'General A', 2, '202', 'General', 'Occupied', feat(true, false, false, false), {
    id: 'pat-x2',
    name: 'Tom Hughes',
    since: '2026-10-18T14:00:00Z',
  }),
  bed('bed-ga-05', 'GA-05', 'ward-general-a', 'General A', 2, '203', 'General', 'Cleaning', feat(false, false, false, false)),
  bed('bed-ga-06', 'GA-06', 'ward-general-a', 'General A', 2, '203', 'General', 'Available', feat(true, false, false, false)),
  bed('bed-ga-07', 'GA-07', 'ward-general-a', 'General A', 2, '204', 'General', 'Reserved', feat(true, false, false, false)),
  bed('bed-ga-08', 'GA-08', 'ward-general-a', 'General A', 2, '204', 'General', 'Available', feat(true, true, false, false)),
  // Maternity
  bed('bed-mat-01', 'MAT-01', 'ward-maternity', 'Maternity', 4, '401', 'General', 'Occupied', feat(true, false, true, false), {
    id: 'pat-x3',
    name: 'Layla Said',
    since: '2026-10-20T05:00:00Z',
  }),
  bed('bed-mat-02', 'MAT-02', 'ward-maternity', 'Maternity', 4, '401', 'General', 'Available', feat(true, false, true, false)),
  bed('bed-mat-03', 'MAT-03', 'ward-maternity', 'Maternity', 4, '402', 'General', 'Available', feat(true, true, true, false)),
  bed('bed-mat-04', 'MAT-04', 'ward-maternity', 'Maternity', 4, '402', 'Isolation', 'Available', feat(true, true, true, false)),
  // Emergency
  bed('bed-er-01', 'ER-01', 'ward-er', 'Emergency', 1, 'ER-A', 'General', 'Occupied', feat(true, true, true, false), {
    id: 'pat-003',
    name: 'Sofia Martinez',
    since: '2026-10-20T06:15:00Z',
  }),
  bed('bed-er-02', 'ER-02', 'ward-er', 'Emergency', 1, 'ER-A', 'General', 'Available', feat(true, true, true, false)),
  bed('bed-er-03', 'ER-03', 'ward-er', 'Emergency', 1, 'ER-B', 'Isolation', 'Available', feat(true, true, true, true)),
  bed('bed-er-04', 'ER-04', 'ward-er', 'Emergency', 1, 'ER-B', 'General', 'Cleaning', feat(true, true, true, false)),
];

@Injectable({ providedIn: 'root' })
export class BedMockRepository {
  private beds = [...SEED];

  search(criteria: BedSearchCriteria = {}): Observable<Bed[]> {
    let list = [...this.beds];
    if (criteria.wardId && criteria.wardId !== 'ALL') {
      list = list.filter((b) => b.wardId === criteria.wardId);
    }
    if (criteria.status && criteria.status !== 'ALL') {
      list = list.filter((b) => b.status === criteria.status);
    }
    if (criteria.type && criteria.type !== 'ALL') {
      list = list.filter((b) => b.type === criteria.type);
    }
    list.sort((a, b) => a.bedNumber.localeCompare(b.bedNumber));
    return of(list).pipe(delay(180));
  }

  getWards(): Observable<WardSummary[]> {
    const map = new Map<string, WardSummary>();
    for (const b of this.beds) {
      let w = map.get(b.wardId);
      if (!w) {
        w = {
          id: b.wardId,
          name: b.wardName,
          floor: b.floor,
          total: 0,
          available: 0,
          occupied: 0,
          cleaning: 0,
          reserved: 0,
          maintenance: 0,
        };
        map.set(b.wardId, w);
      }
      w.total++;
      const key = b.status.toLowerCase() as keyof Pick<
        WardSummary,
        'available' | 'occupied' | 'cleaning' | 'reserved' | 'maintenance'
      >;
      if (key in w) {
        (w as unknown as Record<string, number>)[key]++;
      }
    }
    return of([...map.values()].sort((a, b) => a.floor - b.floor || a.name.localeCompare(b.name))).pipe(
      delay(120)
    );
  }

  updateStatus(
    id: string,
    status: BedStatus,
    patient?: { id: string; name: string } | null
  ): Observable<Bed> {
    const idx = this.beds.findIndex((b) => b.id === id);
    if (idx < 0) throw new Error('Bed not found');
    const current = this.beds[idx];
    const updated: Bed = {
      ...current,
      status,
      currentPatientId: status === 'Occupied' && patient ? patient.id : status === 'Occupied' ? current.currentPatientId : undefined,
      currentPatientName:
        status === 'Occupied' && patient
          ? patient.name
          : status === 'Occupied'
            ? current.currentPatientName
            : undefined,
      admissionDate:
        status === 'Occupied'
          ? current.admissionDate ?? new Date().toISOString()
          : undefined,
    };
    this.beds = [...this.beds.slice(0, idx), updated, ...this.beds.slice(idx + 1)];
    return of(updated).pipe(delay(250));
  }
}
