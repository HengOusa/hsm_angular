import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { authReducer } from './store/auth/auth.reducer';
import { uiReducer } from './store/ui/ui.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { patientsReducer } from './features/patients/store/patient.reducer';
import { PatientEffects } from './features/patients/store/patient.effects';
import { appointmentsReducer } from './features/appointments/store/appointment.reducer';
import { AppointmentEffects } from './features/appointments/store/appointment.effects';
import { bedsReducer } from './features/beds/store/bed.reducer';
import { BedEffects } from './features/beds/store/bed.effects';
import { emrReducer } from './features/emr/store/emr.reducer';
import { EmrEffects } from './features/emr/store/emr.effects';
import { pharmacyReducer } from './features/pharmacy/store/pharmacy.reducer';
import { PharmacyEffects } from './features/pharmacy/store/pharmacy.effects';
import { labReducer } from './features/laboratory/store/lab.reducer';
import { LabEffects } from './features/laboratory/store/lab.effects';
import { emergencyReducer } from './features/emergency/store/emergency.reducer';
import { EmergencyEffects } from './features/emergency/store/emergency.effects';
import { billingReducer } from './features/billing/store/billing.reducer';
import { BillingEffects } from './features/billing/store/billing.effects';
import { staffReducer } from './features/staff/store/staff.reducer';
import { StaffEffects } from './features/staff/store/staff.effects';
import { notificationsReducer } from './features/notifications/store/notification.reducer';
import { NotificationEffects } from './features/notifications/store/notification.effects';
import { settingsReducer } from './features/settings/store/settings.reducer';
import { SettingsEffects } from './features/settings/store/settings.effects';
import { auditReducer } from './features/audit/store/audit.reducer';
import { AuditEffects } from './features/audit/store/audit.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions()
    ),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor,
        loadingInterceptor,
      ])
    ),
    provideStore({
      auth: authReducer,
      ui: uiReducer,
      patients: patientsReducer,
      appointments: appointmentsReducer,
      beds: bedsReducer,
      emr: emrReducer,
      pharmacy: pharmacyReducer,
      lab: labReducer,
      emergency: emergencyReducer,
      billing: billingReducer,
      staff: staffReducer,
      notifications: notificationsReducer,
      settings: settingsReducer,
      audit: auditReducer,
    }),
    provideEffects([AuthEffects, PatientEffects, AppointmentEffects, BedEffects, EmrEffects, PharmacyEffects, LabEffects, EmergencyEffects, BillingEffects, StaffEffects, NotificationEffects, SettingsEffects, AuditEffects]),
    provideStoreDevtools({
      maxAge: 50,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      connectInZone: true,
    }),
  ],
};
