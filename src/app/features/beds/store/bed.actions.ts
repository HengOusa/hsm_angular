import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Bed, BedSearchCriteria, BedStatus, WardSummary } from '../domain/bed.entity';

export const BedActions = createActionGroup({
  source: 'Beds',
  events: {
    'Load': props<{ criteria?: BedSearchCriteria }>(),
    'Load Success': props<{ beds: Bed[]; wards: WardSummary[] }>(),
    'Load Failure': props<{ error: string }>(),

    'Set Ward Filter': props<{ wardId: string }>(),
    'Set Status Filter': props<{ status: BedStatus | 'ALL' }>(),

    'Update Status': props<{
      id: string;
      status: BedStatus;
      patient?: { id: string; name: string } | null;
    }>(),
    'Update Status Success': props<{ bed: Bed }>(),
    'Update Status Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
  },
});
