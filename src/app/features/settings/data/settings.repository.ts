import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { DEFAULT_PREFERENCES, UserPreferences } from '../domain/settings.entity';

const KEY = 'medicore.preferences';

@Injectable({ providedIn: 'root' })
export class SettingsRepository {
  load(): Observable<UserPreferences> {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        return of({ ...DEFAULT_PREFERENCES, ...JSON.parse(raw) }).pipe(delay(80));
      }
    } catch {
      /* ignore */
    }
    return of({ ...DEFAULT_PREFERENCES }).pipe(delay(80));
  }

  save(prefs: UserPreferences): Observable<UserPreferences> {
    localStorage.setItem(KEY, JSON.stringify(prefs));
    return of(prefs).pipe(delay(150));
  }

  reset(): Observable<UserPreferences> {
    localStorage.removeItem(KEY);
    return of({ ...DEFAULT_PREFERENCES }).pipe(delay(100));
  }
}
