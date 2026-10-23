import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { StaffMember, Shift, StaffSearchCriteria, ShiftType } from '../domain/staff.entity';

export const StaffActions = createActionGroup({
  source: 'Staff',
  events: {
    'Load': props<{ criteria?: StaffSearchCriteria }>(),
    'Load Success': props<{ staff: StaffMember[]; shifts: Shift[] }>(),
    'Load Failure': props<{ error: string }>(),

    'Create Shift': props<{
      staffId: string;
      date: string;
      shiftType: ShiftType;
      location?: string;
      notes?: string;
    }>(),
    'Create Shift Success': props<{ shift: Shift }>(),
    'Create Shift Failure': props<{ error: string }>(),

    'Confirm Shift': props<{ id: string }>(),
    'Confirm Shift Success': props<{ shift: Shift }>(),
    'Confirm Shift Failure': props<{ error: string }>(),

    'Cancel Shift': props<{ id: string }>(),
    'Cancel Shift Success': props<{ shift: Shift }>(),
    'Cancel Shift Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
  },
});
