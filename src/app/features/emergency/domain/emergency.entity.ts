export type TriageLevel =
  | 'Immediate'
  | 'Urgent'
  | 'LessUrgent'
  | 'NonUrgent'
  | 'Deceased';

export type EmergencyCaseStatus =
  | 'Triaging'
  | 'InProgress'
  | 'Admitted'
  | 'Discharged'
  | 'Transferred'
  | 'Expired';

export type ArrivalMode = 'WalkIn' | 'Ambulance' | 'Police' | 'Transfer' | 'Other';

export interface EmergencyCase {
  id: string;
  caseNumber: string;
  patientId?: string;
  patientName: string;
  ageYears?: number;
  gender?: string;
  triageLevel: TriageLevel;
  chiefComplaint: string;
  arrivalMode: ArrivalMode;
  arrivalTime: string;
  triageTime?: string;
  doctorSeenTime?: string;
  status: EmergencyCaseStatus;
  assignedDoctor?: string;
  assignedRoom?: string;
  teamMembers: string[];
  interventions: string[];
  disposition?: string;
  dispositionTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencySearchCriteria {
  status?: EmergencyCaseStatus | 'ACTIVE' | 'ALL';
  triageLevel?: TriageLevel | 'ALL';
}

/** ESI-inspired acuity sort: Immediate first */
export const TRIAGE_ORDER: TriageLevel[] = [
  'Immediate',
  'Urgent',
  'LessUrgent',
  'NonUrgent',
  'Deceased',
];

export function triageSortKey(level: TriageLevel): number {
  return TRIAGE_ORDER.indexOf(level);
}
