import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuditActions } from './audit.actions';
import { selectAuditEntries, selectAuditLoading } from './audit.selectors';
import { AuditAction } from '../domain/audit.entity';

@Injectable({ providedIn: 'root' })
export class AuditFacade {
  private readonly store = inject(Store);

  readonly entries = this.store.selectSignal(selectAuditEntries);
  readonly loading = this.store.selectSignal(selectAuditLoading);

  load(action?: AuditAction | 'ALL', query?: string): void {
    this.store.dispatch(AuditActions.load({ action, query }));
  }
}
