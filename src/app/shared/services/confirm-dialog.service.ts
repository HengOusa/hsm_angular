import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../components/confirm-dialog/confirm-dialog.component';

/**
 * Convenience wrapper around MatDialog for confirmations.
 *
 * @example
 * this.confirm.open({
 *   title: 'Discharge patient?',
 *   message: 'This will free the bed and generate a discharge summary.',
 *   confirmLabel: 'Discharge',
 *   variant: 'danger',
 * }).subscribe(ok => { if (ok) this.discharge(); });
 */
@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private readonly dialog = inject(MatDialog);

  open(data: ConfirmDialogData): Observable<boolean> {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data,
      width: '420px',
      disableClose: true,
      autoFocus: 'dialog',
    });
    return ref.afterClosed() as Observable<boolean>;
  }
}
