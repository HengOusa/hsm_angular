import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../services/notification.service';

/**
 * Global HTTP error handling.
 * - 401 → logout
 * - 403 → toast
 * - 5xx → generic error toast
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.logout();
        notify.error('Session expired. Please sign in again.');
      } else if (error.status === 403) {
        notify.error('You do not have permission to perform this action.');
      } else if (error.status === 0) {
        notify.error('Unable to reach the server. Check your connection.');
      } else if (error.status >= 500) {
        notify.error('A server error occurred. Please try again later.');
      } else {
        const message =
          (error.error as { message?: string })?.message ??
          error.message ??
          'An unexpected error occurred.';
        notify.error(message);
      }
      return throwError(() => error);
    })
  );
};
