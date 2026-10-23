import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LabTest, LabTestCatalogItem, LabTestStatus, LabSearchCriteria } from '../domain/lab.entity';

export const LabActions = createActionGroup({
  source: 'Lab',
  events: {
    'Load': props<{ criteria?: LabSearchCriteria }>(),
    'Load Success': props<{ tests: LabTest[] }>(),
    'Load Failure': props<{ error: string }>(),

    'Load Catalog Success': props<{ catalog: LabTestCatalogItem[] }>(),

    'Create Order': props<{
      patientId: string;
      patientName: string;
      orderedBy: string;
      orderedByName: string;
      testCodes: string[];
    }>(),
    'Create Order Success': props<{ tests: LabTest[] }>(),
    'Create Order Failure': props<{ error: string }>(),

    'Update Status': props<{ id: string; status: LabTestStatus }>(),
    'Update Status Success': props<{ test: LabTest }>(),
    'Update Status Failure': props<{ error: string }>(),

    'Enter Result': props<{
      id: string;
      result: string;
      numericResult?: number;
      reportedBy: string;
      notes?: string;
    }>(),
    'Enter Result Success': props<{ test: LabTest }>(),
    'Enter Result Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
  },
});
