import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, forkJoin } from 'rxjs';
import { map, catchError, switchMap, exhaustMap, tap } from 'rxjs/operators';
import { BillingActions } from './billing.actions';
import { BillingMockRepository } from '../data/billing-mock.repository';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable()
export class BillingEffects {
  private readonly actions$ = inject(Actions);
  private readonly repo = inject(BillingMockRepository);
  private readonly notify = inject(NotificationService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BillingActions.load),
      switchMap(({ status, query }) =>
        forkJoin({
          invoices: this.repo.listInvoices(status, query),
          revenue: this.repo.revenue(),
        }).pipe(
          map(({ invoices, revenue }) =>
            BillingActions.loadSuccess({ invoices, revenue })
          ),
          catchError((e) =>
            of(BillingActions.loadFailure({ error: e?.message ?? 'Failed' }))
          )
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BillingActions.createInvoice),
      exhaustMap((action) =>
        this.repo
          .createInvoice({
            patientId: action.patientId,
            patientName: action.patientName,
            department: action.department,
            dueDays: action.dueDays,
            lines: action.lines,
            discount: action.discount,
            notes: action.notes,
          })
          .pipe(
            map((invoice) => BillingActions.createInvoiceSuccess({ invoice })),
            catchError((e) =>
              of(
                BillingActions.createInvoiceFailure({
                  error: e?.message ?? 'Create failed',
                })
              )
            )
          )
      )
    )
  );

  createOk$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BillingActions.createInvoiceSuccess),
        tap(({ invoice }) =>
          this.notify.success(`Invoice ${invoice.invoiceNumber} issued`)
        )
      ),
    { dispatch: false }
  );

  // Refresh revenue after create
  createRefresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BillingActions.createInvoiceSuccess),
      map(() => BillingActions.load({}))
    )
  );

  pay$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BillingActions.recordPayment),
      exhaustMap((action) => {
        try {
          return this.repo
            .recordPayment({
              invoiceId: action.invoiceId,
              amount: action.amount,
              method: action.method,
              receivedBy: action.receivedBy,
              reference: action.reference,
            })
            .pipe(
              map(({ invoice, payment }) =>
                BillingActions.recordPaymentSuccess({ invoice, payment })
              ),
              catchError((e) =>
                of(
                  BillingActions.recordPaymentFailure({
                    error: e?.message ?? 'Payment failed',
                  })
                )
              )
            );
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Payment failed';
          return of(BillingActions.recordPaymentFailure({ error: msg }));
        }
      })
    )
  );

  payOk$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BillingActions.recordPaymentSuccess),
        tap(({ invoice, payment }) =>
          this.notify.success(
            `Payment $${payment.amount.toFixed(2)} · balance $${invoice.balance.toFixed(2)}`
          )
        )
      ),
    { dispatch: false }
  );

  payRefresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BillingActions.recordPaymentSuccess),
      map(() => BillingActions.load({}))
    )
  );

  payFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BillingActions.recordPaymentFailure),
        tap(({ error }) => this.notify.error(error))
      ),
    { dispatch: false }
  );
}
