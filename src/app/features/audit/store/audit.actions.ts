import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuditEntry, AuditAction } from '../domain/audit.entity';

export const AuditActions = createActionGroup({
  source: 'Audit',
  events: {
    'Load': props<{ action?: AuditAction | 'ALL'; query?: string }>(),
    'Load Success': props<{ entries: AuditEntry[] }>(),
    'Load Failure': props<{ error: string }>(),
    'Clear Error': emptyProps(),
  },
});
