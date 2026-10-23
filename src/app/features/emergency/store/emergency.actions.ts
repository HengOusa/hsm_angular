import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  EmergencyCase,
  EmergencySearchCriteria,
  TriageLevel,
  EmergencyCaseStatus,
} from '../domain/emergency.entity';

export const EmergencyActions = createActionGroup({
  source: 'Emergency',
  events: {
    'Load': props<{ criteria?: EmergencySearchCriteria }>(),
    'Load Success': props<{ cases: EmergencyCase[] }>(),
    'Load Failure': props<{ error: string }>(),

    'Create': props<{
      case: Omit<
        EmergencyCase,
        'id' | 'caseNumber' | 'createdAt' | 'updatedAt' | 'teamMembers' | 'interventions'
      > & { teamMembers?: string[]; interventions?: string[] };
    }>(),
    'Create Success': props<{ case: EmergencyCase }>(),
    'Create Failure': props<{ error: string }>(),

    'Update': props<{ id: string; patch: Partial<EmergencyCase> }>(),
    'Update Success': props<{ case: EmergencyCase }>(),
    'Update Failure': props<{ error: string }>(),

    'Activate Trauma': props<{ id: string }>(),
    'Activate Trauma Success': props<{ case: EmergencyCase }>(),
    'Activate Trauma Failure': props<{ error: string }>(),

    'Set Status Filter': props<{ status: EmergencyCaseStatus | 'ACTIVE' | 'ALL' }>(),
    'Set Triage Filter': props<{ triage: TriageLevel | 'ALL' }>(),
    'Clear Error': emptyProps(),
  },
});
