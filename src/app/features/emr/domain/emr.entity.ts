export interface VitalSigns {
  id: string;
  patientId: string;
  recordedBy: string;
  recordedAt: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  spo2?: number;
  respiratoryRate?: number;
  bloodGlucose?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  pain?: number;
  notes?: string;
  isAbnormal: boolean;
  abnormalFlags: string[];
}

export interface SoapNote {
  id: string;
  patientId: string;
  patientName: string;
  authorId: string;
  authorName: string;
  visitDate: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  diagnoses: Icd10Code[];
  vitalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Icd10Code {
  code: string;
  description: string;
}

export function computeBmi(weightKg?: number, heightCm?: number): number | undefined {
  if (!weightKg || !heightCm || heightCm <= 0) return undefined;
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

export function detectAbnormalVitals(v: Partial<VitalSigns>): string[] {
  const flags: string[] = [];
  if (v.bloodPressureSystolic != null && (v.bloodPressureSystolic >= 140 || v.bloodPressureSystolic < 90)) {
    flags.push('BP systolic');
  }
  if (v.bloodPressureDiastolic != null && (v.bloodPressureDiastolic >= 90 || v.bloodPressureDiastolic < 60)) {
    flags.push('BP diastolic');
  }
  if (v.heartRate != null && (v.heartRate > 100 || v.heartRate < 50)) {
    flags.push('Heart rate');
  }
  if (v.temperature != null && (v.temperature >= 38 || v.temperature < 35)) {
    flags.push('Temperature');
  }
  if (v.spo2 != null && v.spo2 < 94) {
    flags.push('SpO₂');
  }
  if (v.respiratoryRate != null && (v.respiratoryRate > 24 || v.respiratoryRate < 10)) {
    flags.push('RR');
  }
  if (v.pain != null && v.pain >= 7) {
    flags.push('Pain');
  }
  return flags;
}
