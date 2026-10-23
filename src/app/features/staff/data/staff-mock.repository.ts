import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  StaffMember,
  Shift,
  StaffSearchCriteria,
  ShiftType,
  SHIFT_HOURS,
  findShiftConflicts,
} from '../domain/staff.entity';

const STAFF: StaffMember[] = [
  {
    id: 'st-001',
    employeeId: 'EMP-1001',
    firstName: 'Sarah',
    lastName: 'Chen',
    role: 'Doctor',
    department: 'Cardiology',
    email: 'george.a@example.org',
    isActive: true,
  },
  {
    id: 'st-002',
    employeeId: 'EMP-1002',
    firstName: 'Raj',
    lastName: 'Patel',
    role: 'Doctor',
    department: 'Emergency',
    email: 'laura.c@example.net',
    isActive: true,
  },
  {
    id: 'st-003',
    employeeId: 'EMP-2001',
    firstName: 'Aya',
    lastName: 'Hassan',
    role: 'Nurse',
    department: 'ICU',
    email: 'yosef.c@example.com',
    isActive: true,
  },
  {
    id: 'st-004',
    employeeId: 'EMP-2002',
    firstName: 'Omar',
    lastName: 'Said',
    role: 'Nurse',
    department: 'Emergency',
    email: 'yosef.c@example.com',
    isActive: true,
  },
  {
    id: 'st-005',
    employeeId: 'EMP-3001',
    firstName: 'Lee',
    lastName: 'Park',
    role: 'Pharmacist',
    department: 'Pharmacy',
    email: 'emma.t@example.net',
    isActive: true,
  },
  {
    id: 'st-006',
    employeeId: 'EMP-4001',
    firstName: 'Kim',
    lastName: 'Nguyen',
    role: 'LabTechnician',
    department: 'Laboratory',
    email: 'yuki.t@example.com',
    isActive: true,
  },
];

function todayOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

@Injectable({ providedIn: 'root' })
export class StaffMockRepository {
  private staff = [...STAFF];
  private shiftSeq = 10;
  private shifts: Shift[] = [
    {
      id: 'sh-001',
      staffId: 'st-002',
      staffName: 'Raj Patel',
      role: 'Doctor',
      department: 'Emergency',
      date: todayOffset(0),
      shiftType: 'Morning',
      startTime: '07:00',
      endTime: '15:00',
      status: 'Confirmed',
      location: 'ER',
      conflictIds: [],
    },
    {
      id: 'sh-002',
      staffId: 'st-004',
      staffName: 'Omar Said',
      role: 'Nurse',
      department: 'Emergency',
      date: todayOffset(0),
      shiftType: 'Morning',
      startTime: '07:00',
      endTime: '15:00',
      status: 'Confirmed',
      location: 'ER',
      conflictIds: [],
    },
    {
      id: 'sh-003',
      staffId: 'st-001',
      staffName: 'Sarah Chen',
      role: 'Doctor',
      department: 'Cardiology',
      date: todayOffset(0),
      shiftType: 'Afternoon',
      startTime: '15:00',
      endTime: '23:00',
      status: 'Scheduled',
      location: 'Clinic A',
      conflictIds: [],
    },
    {
      id: 'sh-004',
      staffId: 'st-003',
      staffName: 'Aya Hassan',
      role: 'Nurse',
      department: 'ICU',
      date: todayOffset(0),
      shiftType: 'Night',
      startTime: '23:00',
      endTime: '07:00',
      status: 'Scheduled',
      location: 'ICU',
      conflictIds: [],
    },
    {
      id: 'sh-005',
      staffId: 'st-002',
      staffName: 'Raj Patel',
      role: 'Doctor',
      department: 'Emergency',
      date: todayOffset(0),
      shiftType: 'Afternoon',
      startTime: '14:00',
      endTime: '22:00',
      status: 'Scheduled',
      location: 'ER',
      conflictIds: [],
    },
    {
      id: 'sh-006',
      staffId: 'st-005',
      staffName: 'Lee Park',
      role: 'Pharmacist',
      department: 'Pharmacy',
      date: todayOffset(1),
      shiftType: 'Morning',
      startTime: '07:00',
      endTime: '15:00',
      status: 'Scheduled',
      location: 'Pharmacy',
      conflictIds: [],
    },
  ];

  constructor() {
    this.recomputeConflicts();
  }

  private recomputeConflicts(): void {
    const map = findShiftConflicts(this.shifts);
    this.shifts = this.shifts.map((s) => ({
      ...s,
      conflictIds: map.get(s.id) ?? [],
    }));
  }

  listStaff(): Observable<StaffMember[]> {
    return of(this.staff.filter((s) => s.isActive)).pipe(delay(80));
  }

  listShifts(criteria: StaffSearchCriteria = {}): Observable<Shift[]> {
    let list = [...this.shifts];
    if (criteria.department && criteria.department !== 'ALL') {
      list = list.filter((s) => s.department === criteria.department);
    }
    if (criteria.role && criteria.role !== 'ALL') {
      list = list.filter((s) => s.role === criteria.role);
    }
    if (criteria.staffId) {
      list = list.filter((s) => s.staffId === criteria.staffId);
    }
    if (criteria.dateFrom) {
      list = list.filter((s) => s.date >= criteria.dateFrom!);
    }
    if (criteria.dateTo) {
      list = list.filter((s) => s.date <= criteria.dateTo!);
    }
    list.sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
    return of(list).pipe(delay(160));
  }

  createShift(input: {
    staffId: string;
    date: string;
    shiftType: ShiftType;
    location?: string;
    notes?: string;
  }): Observable<Shift> {
    const member = this.staff.find((s) => s.id === input.staffId);
    if (!member) throw new Error('Staff not found');
    const hours = SHIFT_HOURS[input.shiftType];
    const shift: Shift = {
      id: `sh-${String(this.shiftSeq++).padStart(3, '0')}`,
      staffId: member.id,
      staffName: `${member.firstName} ${member.lastName}`,
      role: member.role,
      department: member.department,
      date: input.date,
      shiftType: input.shiftType,
      startTime: hours.start,
      endTime: hours.end,
      status: 'Scheduled',
      location: input.location,
      notes: input.notes,
      conflictIds: [],
    };
    this.shifts = [shift, ...this.shifts];
    this.recomputeConflicts();
    const withConflicts = this.shifts.find((s) => s.id === shift.id)!;
    return of(withConflicts).pipe(delay(280));
  }

  cancelShift(id: string): Observable<Shift> {
    const idx = this.shifts.findIndex((s) => s.id === id);
    if (idx < 0) throw new Error('Shift not found');
    const updated: Shift = {
      ...this.shifts[idx],
      status: 'Cancelled',
      conflictIds: [],
    };
    this.shifts = [...this.shifts.slice(0, idx), updated, ...this.shifts.slice(idx + 1)];
    this.recomputeConflicts();
    return of(this.shifts.find((s) => s.id === id)!).pipe(delay(200));
  }

  confirmShift(id: string): Observable<Shift> {
    const idx = this.shifts.findIndex((s) => s.id === id);
    if (idx < 0) throw new Error('Shift not found');
    const updated: Shift = { ...this.shifts[idx], status: 'Confirmed' };
    this.shifts = [...this.shifts.slice(0, idx), updated, ...this.shifts.slice(idx + 1)];
    this.recomputeConflicts();
    return of(this.shifts.find((s) => s.id === id)!).pipe(delay(180));
  }
}
