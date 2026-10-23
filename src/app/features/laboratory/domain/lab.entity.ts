export type LabTestStatus =
  | 'Ordered'
  | 'SampleCollected'
  | 'Processing'
  | 'Completed'
  | 'Reported';

export type LabCategory = 'Hematology' | 'Chemistry' | 'Microbiology' | 'Immunology' | 'Other';

export interface LabTestCatalogItem {
  code: string;
  name: string;
  category: LabCategory;
  sampleType: string;
  unit?: string;
  referenceRange?: string;
  criticalLow?: number;
  criticalHigh?: number;
}

export interface LabTest {
  id: string;
  orderId: string;
  patientId: string;
  patientName: string;
  orderedBy: string;
  orderedByName: string;
  testCode: string;
  testName: string;
  category: LabCategory;
  sampleType: string;
  sampleCollectedAt?: string;
  status: LabTestStatus;
  result?: string;
  numericResult?: number;
  unit?: string;
  referenceRange?: string;
  isCritical: boolean;
  isAbnormal: boolean;
  reportedBy?: string;
  reportedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabSearchCriteria {
  status?: LabTestStatus | 'ALL';
  query?: string;
  criticalOnly?: boolean;
}

export function evaluateResult(
  numeric: number | undefined,
  catalog: LabTestCatalogItem
): { isAbnormal: boolean; isCritical: boolean } {
  if (numeric == null || Number.isNaN(numeric)) {
    return { isAbnormal: false, isCritical: false };
  }
  let isCritical = false;
  if (catalog.criticalLow != null && numeric <= catalog.criticalLow) isCritical = true;
  if (catalog.criticalHigh != null && numeric >= catalog.criticalHigh) isCritical = true;

  let isAbnormal = isCritical;
  if (catalog.referenceRange) {
    // Simple "low-high" parse e.g. "3.5-5.0"
    const m = catalog.referenceRange.match(/([\d.]+)\s*-\s*([\d.]+)/);
    if (m) {
      const low = parseFloat(m[1]);
      const high = parseFloat(m[2]);
      if (numeric < low || numeric > high) isAbnormal = true;
    }
  }
  return { isAbnormal, isCritical };
}
