import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

export interface AuditEntry {
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  timestamp?: string;
}

/**
 * Audit trail logging for HIPAA-aware access tracking.
 * Fire-and-forget; failures should not block clinical workflow.
 */
@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  log(entry: AuditEntry): void {
    const user = this.auth.getCurrentUser();
    const payload = {
      ...entry,
      userId: user?.id,
      userRole: user?.role,
      timestamp: entry.timestamp ?? new Date().toISOString(),
    };

    // In starter mode, log to console. Replace with real API.
    if (!environment.production) {
      console.info('[Audit]', payload);
      return;
    }

    this.http.post(`${environment.apiUrl}/audit`, payload).subscribe({
      error: () => {
        // swallow – never block UI
      },
    });
  }

  logAccess(resource: string, resourceId: string): void {
    this.log({ action: 'ACCESS', resource, resourceId });
  }

  logCreate(resource: string, resourceId: string, details?: Record<string, unknown>): void {
    this.log({ action: 'CREATE', resource, resourceId, details });
  }

  logUpdate(resource: string, resourceId: string, details?: Record<string, unknown>): void {
    this.log({ action: 'UPDATE', resource, resourceId, details });
  }

  logDelete(resource: string, resourceId: string): void {
    this.log({ action: 'DELETE', resource, resourceId });
  }
}
