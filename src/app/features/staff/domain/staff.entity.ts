export type StaffRole =
  | 'Doctor'
  | 'Nurse'
  | 'Receptionist'
  | 'Pharmacist'
  | 'LabTechnician'
  | 'Admin'
  | 'Other';

export type ShiftType = 'Morning' | 'Afternoon' | 'Night' | 'OnCall';
export type ShiftStatus = 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'NoShow';

export interface StaffMember {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  role: StaffRole;
  department: string;
  email: string;
  phone?: string;
  isActive: boolean;
}

export interface Shift {
  id: string;
  staffId: string;
  staffName: string;
  role: StaffRole;
  department: string;
  date: string; // YYYY-MM-DD
  shiftType: ShiftType;
  startTime: string; // HH:mm
  endTime: string;
  status: ShiftStatus;
  location?: string;
  notes?: string;
  conflictIds: string[];
}

export interface StaffSearchCriteria {
  department?: string | 'ALL';
  role?: StaffRole | 'ALL';
  dateFrom?: string;
  dateTo?: string;
  staffId?: string;
}

/** Detect overlapping shifts for same staff on same day */
export function findShiftConflicts(shifts: Shift[]): Map<string, string[]> {
  const byStaffDate = new Map<string, Shift[]>();
  for (const s of shifts) {
    if (s.status === 'Cancelled') continue;
    const key = `${s.staffId}|${s.date}`;
    const list = byStaffDate.get(key) ?? [];
    list.push(s);
    byStaffDate.set(key, list);
  }

  const conflicts = new Map<string, string[]>();
  for (const list of byStaffDate.values()) {
    if (list.length < 2) continue;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        if (overlaps(list[i], list[j])) {
          const a = conflicts.get(list[i].id) ?? [];
          const b = conflicts.get(list[j].id) ?? [];
          a.push(list[j].id);
          b.push(list[i].id);
          conflicts.set(list[i].id, a);
          conflicts.set(list[j].id, b);
        }
      }
    }
  }
  return conflicts;
}

function overlaps(a: Shift, b: Shift): boolean {
  if (a.date !== b.date) return false;
  const as = toMinutes(a.startTime);
  const ae = toMinutes(a.endTime);
  const bs = toMinutes(b.startTime);
  const be = toMinutes(b.endTime);
  // Night shifts may wrap; treat end < start as +24h
  const aeAdj = ae <= as ? ae + 24 * 60 : ae;
  const beAdj = be <= bs ? be + 24 * 60 : be;
  return as < beAdj && bs < aeAdj;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + (m || 0);
}

export const SHIFT_HOURS: Record<ShiftType, { start: string; end: string }> = {
  Morning: { start: '07:00', end: '15:00' },
  Afternoon: { start: '15:00', end: '23:00' },
  Night: { start: '23:00', end: '07:00' },
  OnCall: { start: '00:00', end: '23:59' },
};
