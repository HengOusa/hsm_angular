import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SoapNote, VitalSigns, Icd10Code } from '../domain/emr.entity';

export const EmrActions = createActionGroup({
  source: 'EMR',
  events: {
    'Load Notes': props<{ patientId?: string }>(),
    'Load Notes Success': props<{ notes: SoapNote[] }>(),
    'Load Notes Failure': props<{ error: string }>(),

    'Save Note': props<{ note: Omit<SoapNote, 'id' | 'createdAt' | 'updatedAt'> }>(),
    'Save Note Success': props<{ note: SoapNote }>(),
    'Save Note Failure': props<{ error: string }>(),

    'Load Vitals': props<{ patientId?: string }>(),
    'Load Vitals Success': props<{ vitals: VitalSigns[] }>(),
    'Load Vitals Failure': props<{ error: string }>(),

    'Save Vitals': props<{
      vitals: Omit<VitalSigns, 'id' | 'bmi' | 'isAbnormal' | 'abnormalFlags'>;
    }>(),
    'Save Vitals Success': props<{ vitals: VitalSigns }>(),
    'Save Vitals Failure': props<{ error: string }>(),

    'Search Icd': props<{ query: string }>(),
    'Search Icd Success': props<{ results: Icd10Code[] }>(),

    'Clear Error': emptyProps(),
  },
});
