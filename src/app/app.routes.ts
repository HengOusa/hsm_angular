import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        data: { title: 'Command Center' },
      },
      {
        path: 'patients',
        canActivate: [roleGuard],
        loadChildren: () =>
          import('./features/patients/patients.routes').then(
            (m) => m.PATIENTS_ROUTES
          ),
        data: {
          title: 'Patients',
          roles: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'],
        },
      },
      {
        path: 'appointments',
        loadChildren: () =>
          import('./features/appointments/appointments.routes').then(
            (m) => m.APPOINTMENTS_ROUTES
          ),
        data: { title: 'Appointments' },
      },
      {
        path: 'beds',
        loadComponent: () =>
          import('./features/beds/pages/bed-board/bed-board.component').then(
            (m) => m.BedBoardComponent
          ),
        data: { title: 'Ward & Beds' },
      },
      {
        path: 'emr',
        loadComponent: () =>
          import('./features/emr/pages/emr-workspace/emr-workspace.component').then(
            (m) => m.EmrWorkspaceComponent
          ),
        data: { title: 'EMR' },
      },
      {
        path: 'pharmacy',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/pharmacy/pages/pharmacy-workspace/pharmacy-workspace.component').then(
            (m) => m.PharmacyWorkspaceComponent
          ),
        data: {
          title: 'Pharmacy',
          roles: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'PHARMACIST'],
        },
      },
      {
        path: 'laboratory',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/laboratory/pages/lab-workspace/lab-workspace.component').then(
            (m) => m.LabWorkspaceComponent
          ),
        data: {
          title: 'Laboratory',
          roles: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN'],
        },
      },
      {
        path: 'emergency',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/emergency/pages/er-board/er-board.component').then(
            (m) => m.ErBoardComponent
          ),
        data: {
          title: 'Emergency',
          roles: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'NURSE'],
        },
      },
      {
        path: 'billing',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/billing/pages/billing-workspace/billing-workspace.component').then(
            (m) => m.BillingWorkspaceComponent
          ),
        data: {
          title: 'Billing',
          roles: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'RECEPTIONIST'],
        },
      },
      {
        path: 'staff',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/staff/pages/staff-roster/staff-roster.component').then(
            (m) => m.StaffRosterComponent
          ),
        data: {
          title: 'Staff',
          roles: ['SUPER_ADMIN', 'HOSPITAL_ADMIN'],
        },
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notifications/pages/notification-center/notification-center.component').then(
            (m) => m.NotificationCenterComponent
          ),
        data: { title: 'Notifications' },
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/pages/reports-dashboard/reports-dashboard.component').then(
            (m) => m.ReportsDashboardComponent
          ),
        data: { title: 'Reports' },
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/pages/settings-page/settings-page.component').then(
            (m) => m.SettingsPageComponent
          ),
        data: { title: 'Settings' },
      },
      {
        path: 'audit',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/audit/pages/audit-log/audit-log.component').then(
            (m) => m.AuditLogComponent
          ),
        data: {
          title: 'Audit log',
          roles: ['SUPER_ADMIN', 'HOSPITAL_ADMIN'],
        },
      },
      {
        path: 'nursing',
        loadComponent: () =>
          import('./features/nursing/pages/nursing-board/nursing-board.component').then(
            (m) => m.NursingBoardComponent
          ),
        data: { title: 'Nursing' },
      },
      {
        path: 'unauthorized',
        loadComponent: () =>
          import('./pages/errors/unauthorized/unauthorized.component').then(
            (m) => m.UnauthorizedComponent
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/errors/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
