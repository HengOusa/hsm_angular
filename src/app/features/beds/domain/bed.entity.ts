export type BedType = 'General' | 'ICU' | 'CCU' | 'NICU' | 'Isolation' | 'VIP';
export type BedStatus = 'Available' | 'Occupied' | 'Cleaning' | 'Reserved' | 'Maintenance';

export interface BedFeatures {
  oxygen: boolean;
  suction: boolean;
  monitor: boolean;
  ventilator: boolean;
}

export interface Bed {
  id: string;
  bedNumber: string;
  wardId: string;
  wardName: string;
  floor: number;
  room: string;
  type: BedType;
  status: BedStatus;
  currentPatientId?: string;
  currentPatientName?: string;
  admissionDate?: string;
  features: BedFeatures;
}

export interface WardSummary {
  id: string;
  name: string;
  floor: number;
  total: number;
  available: number;
  occupied: number;
  cleaning: number;
  reserved: number;
  maintenance: number;
}

export interface BedSearchCriteria {
  wardId?: string | 'ALL';
  status?: BedStatus | 'ALL';
  type?: BedType | 'ALL';
}
