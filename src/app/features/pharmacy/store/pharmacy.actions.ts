import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Drug, Prescription, PrescriptionStatus } from '../domain/pharmacy.entity';

export const PharmacyActions = createActionGroup({
  source: 'Pharmacy',
  events: {
    'Load Inventory': props<{ query?: string; lowStockOnly?: boolean }>(),
    'Load Inventory Success': props<{ drugs: Drug[] }>(),
    'Load Inventory Failure': props<{ error: string }>(),

    'Load Prescriptions': props<{ status?: PrescriptionStatus | 'ALL' }>(),
    'Load Prescriptions Success': props<{ prescriptions: Prescription[] }>(),
    'Load Prescriptions Failure': props<{ error: string }>(),

    'Dispense': props<{ id: string; dispensedBy: string }>(),
    'Dispense Success': props<{ prescription: Prescription }>(),
    'Dispense Failure': props<{ error: string }>(),

    'Cancel Rx': props<{ id: string }>(),
    'Cancel Rx Success': props<{ prescription: Prescription }>(),
    'Cancel Rx Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
  },
});
