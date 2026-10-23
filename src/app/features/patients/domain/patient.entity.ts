export type PatientStatus = 'OPD' | 'IPD' | 'ICU' | 'ER' | 'Discharged';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type Gender = 'Male' | 'Female' | 'Other' | 'Unknown';

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  validity: string; // ISO date
}

export interface Patient {
  id: string;
  mrn: string;
  photoUrl?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO
  gender: Gender;
  bloodGroup?: BloodGroup;
  allergies: string[];
  chronicConditions: string[];
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: EmergencyContact;
  insurance?: InsuranceInfo;
  status: PatientStatus;
  admissionDate?: string;
  dischargeDate?: string;
  bedId?: string;
  wardId?: string;
  attendingDoctorId?: string;
  nurseId?: string;
  createdAt: string;
  updatedAt: string;
}

export function patientFullName(p: Pick<Patient, 'firstName' | 'lastName'>): string {
  return `${p.firstName} ${p.lastName}`.trim();
}

export interface PatientSearchCriteria {
  query?: string;
  status?: PatientStatus | 'ALL';
  page?: number;
  pageSize?: number;
}
