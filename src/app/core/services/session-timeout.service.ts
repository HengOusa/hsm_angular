import { Injectable, inject, OnDestroy, NgZone } from '@angular/core';
import { fromEvent, merge, Subscription, timer } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil } from 'rxjs/operators';
import { AuthFacade } from '../../store/auth/auth.facade';
import { environment } from '../../../environments/environment';

/**
 * Tracks user activity and warns before session timeout.
 * Warning at (timeout - 60s), then forces logout if not extended.
 */
@Injectable({ providedIn: 'root' })
export class SessionTimeoutService implements OnDestroy {
  private readonly facade = inject(AuthFacade);
  private readonly zone = inject(NgZone);

  private activitySub: Subscription | null = null;
  private warningSub: Subscription | null = null;
  private countdownSub: Subscription | null = null;

  private readonly timeoutMs = environment.sessionTimeoutMinutes * 60 * 1000;
  private readonly warningBeforeMs = 60 * 1000; // warn 60s before

  start(): void {
    this.stop();
    this.zone.runOutsideAngular(() => {
      const activity$ = merge(
        fromEvent(document, 'mousemove'),
        fromEvent(document, 'mousedown'),
        fromEvent(document, 'keydown'),
        fromEvent(document, 'touchstart'),
        fromEvent(document, 'scroll')
      ).pipe(debounceTime(1000));

      this.activitySub = activity$
        .pipe(filter(() => this.facade.isAuthenticated()))
        .subscribe(() => {
          this.zone.run(() => this.resetTimers());
        });
    });

    this.resetTimers();
  }

  stop(): void {
    this.activitySub?.unsubscribe();
    this.warningSub?.unsubscribe();
    this.countdownSub?.unsubscribe();
    this.activitySub = null;
    this.warningSub = null;
    this.countdownSub = null;
  }

  private resetTimers(): void {
    this.warningSub?.unsubscribe();
    this.countdownSub?.unsubscribe();

    if (!this.facade.isAuthenticated()) return;

    const warnAt = Math.max(0, this.timeoutMs - this.warningBeforeMs);

    this.warningSub = timer(warnAt).subscribe(() => {
      this.zone.run(() => this.startCountdown());
    });
  }

  private startCountdown(): void {
    let remaining = Math.floor(this.warningBeforeMs / 1000);
    this.facade.warnSession(remaining);

    this.countdownSub = timer(0, 1000).subscribe(() => {
      remaining -= 1;
      if (remaining <= 0) {
        this.facade.sessionExpired();
        this.stop();
      } else {
        this.facade.warnSession(remaining);
      }
    });
  }

  /** Called when user clicks "Stay signed in" */
  extend(): void {
    this.facade.extendSession();
    this.resetTimers();
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
