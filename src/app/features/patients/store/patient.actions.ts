import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Patient, PatientSearchCriteria, PatientStatus } from '../domain/patient.entity';
import { PatientListResult } from '../domain/patient.repository';

export const PatientActions = createActionGroup({
  source: 'Patients',
  events: {
    'Search': props<{ criteria: PatientSearchCriteria }>(),
    'Search Success': props<{ result: PatientListResult }>(),
    'Search Failure': props<{ error: string }>(),

    'Load One': props<{ id: string }>(),
    'Load One Success': props<{ patient: Patient }>(),
    'Load One Failure': props<{ error: string }>(),

    'Create': props<{ patient: Omit<Patient, 'id' | 'mrn' | 'createdAt' | 'updatedAt'> }>(),
    'Create Success': props<{ patient: Patient }>(),
    'Create Failure': props<{ error: string }>(),

    'Update': props<{ id: string; patch: Partial<Patient> }>(),
    'Update Success': props<{ patient: Patient }>(),
    'Update Failure': props<{ error: string }>(),

    'Delete': props<{ id: string }>(),
    'Delete Success': props<{ id: string }>(),
    'Delete Failure': props<{ error: string }>(),

    'Set Status Filter': props<{ status: PatientStatus | 'ALL' }>(),
    'Set Query': props<{ query: string }>(),
    'Clear Selected': emptyProps(),
  },
});
