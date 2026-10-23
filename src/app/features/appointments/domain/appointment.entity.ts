export type AppointmentType = 'Scheduled' | 'WalkIn' | 'Emergency' | 'Telemedicine';
export type AppointmentStatus =
  | 'Pending'
  | 'Confirmed'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled'
  | 'NoShow';

export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  departmentId: string;
  departmentName: string;
  type: AppointmentType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  status: AppointmentStatus;
  chiefComplaint?: string;
  notes?: string;
  followUpDate?: string;
  reminderSent: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentSearchCriteria {
  date?: string;
  doctorId?: string;
  status?: AppointmentStatus | 'ALL';
  query?: string;
  page?: number;
  pageSize?: number;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

/** Returns true if two appointments on same doctor/date overlap in time */
export function appointmentsConflict(a: Appointment, b: Appointment): boolean {
  if (a.id === b.id) return false;
  if (a.doctorId !== b.doctorId || a.date !== b.date) return false;
  if (a.status === 'Cancelled' || b.status === 'Cancelled') return false;
  return a.startTime < b.endTime && b.startTime < a.endTime;
}
