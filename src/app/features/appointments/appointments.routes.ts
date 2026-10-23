import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const APPOINTMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/appointment-list/appointment-list.component').then(
        (m) => m.AppointmentListComponent
      ),
    data: { title: 'Appointments' },
  },
  {
    path: 'book',
    canActivate: [roleGuard],
    loadComponent: () =>
      import('./pages/appointment-booking/appointment-booking.component').then(
        (m) => m.AppointmentBookingComponent
      ),
    data: {
      title: 'Book appointment',
      roles: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'RECEPTIONIST', 'NURSE'],
    },
  },
];
