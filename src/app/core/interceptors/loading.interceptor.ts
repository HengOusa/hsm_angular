import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { NotificationService } from '../services/notification.service';

/**
 * Tracks in-flight requests for global loading indicator.
 * Skip with header: X-Skip-Loading: true
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);
  const skip = req.headers.has('X-Skip-Loading');

  if (!skip) {
    notify.showLoading();
  }

  return next(req).pipe(
    finalize(() => {
      if (!skip) {
        notify.hideLoading();
      }
    })
  );
};
