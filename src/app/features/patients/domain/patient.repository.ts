import { Observable } from 'rxjs';
import { Patient, PatientSearchCriteria } from './patient.entity';

export interface PatientListResult {
  items: Patient[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Domain port – implemented by data layer (HTTP / mock).
 */
export abstract class PatientRepository {
  abstract search(criteria: PatientSearchCriteria): Observable<PatientListResult>;
  abstract getById(id: string): Observable<Patient | null>;
  abstract create(patient: Omit<Patient, 'id' | 'mrn' | 'createdAt' | 'updatedAt'>): Observable<Patient>;
  abstract update(id: string, patch: Partial<Patient>): Observable<Patient>;
  abstract delete(id: string): Observable<void>;
}
