import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const PATIENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/patient-list/patient-list.component').then(
        (m) => m.PatientListComponent
      ),
    data: { title: 'All patients' },
  },
  {
    path: 'register',
    canActivate: [roleGuard],
    loadComponent: () =>
      import('./pages/patient-registration/patient-registration.component').then(
        (m) => m.PatientRegistrationComponent
      ),
    data: {
      title: 'Register patient',
      roles: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'],
    },
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/patient-detail/patient-detail.component').then(
        (m) => m.PatientDetailComponent
      ),
    data: { title: 'Patient chart' },
  },
];
