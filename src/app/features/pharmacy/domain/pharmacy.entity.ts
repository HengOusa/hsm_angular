export type DrugCategory = 'Antibiotic' | 'Analgesic' | 'Cardiovascular' | 'Antidiabetic' | 'Respiratory' | 'Other';
export type PrescriptionStatus = 'Pending' | 'Dispensing' | 'Dispensed' | 'Cancelled';

export interface Drug {
  id: string;
  code: string;
  name: string;
  genericName: string;
  category: DrugCategory;
  strength: string;
  form: string; // tablet, syrup, injection
  stockQty: number;
  reorderLevel: number;
  unitPrice: number;
  expiryDate: string;
  controlled: boolean;
}

export interface PrescriptionItem {
  drugId: string;
  drugName: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions?: string;
  isGenericAllowed: boolean;
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  status: PrescriptionStatus;
  medications: PrescriptionItem[];
  notes?: string;
  interactionWarnings: string[];
  createdAt: string;
  dispensedAt?: string;
  dispensedBy?: string;
}

export interface PharmacySearchCriteria {
  query?: string;
  lowStockOnly?: boolean;
  status?: PrescriptionStatus | 'ALL';
}

/** Demo interaction pairs (drug ids) */
export const KNOWN_INTERACTIONS: { a: string; b: string; message: string }[] = [
  {
    a: 'drug-warfarin',
    b: 'drug-aspirin',
    message: 'Warfarin + Aspirin: increased bleeding risk',
  },
  {
    a: 'drug-metformin',
    b: 'drug-contrast',
    message: 'Metformin + iodinated contrast: lactic acidosis risk',
  },
  {
    a: 'drug-lisinopril',
    b: 'drug-spironolactone',
    message: 'ACE inhibitor + potassium-sparing diuretic: hyperkalemia risk',
  },
];

export function findInteractions(drugIds: string[]): string[] {
  const set = new Set(drugIds);
  const warnings: string[] = [];
  for (const pair of KNOWN_INTERACTIONS) {
    if (set.has(pair.a) && set.has(pair.b)) {
      warnings.push(pair.message);
    }
  }
  return warnings;
}
