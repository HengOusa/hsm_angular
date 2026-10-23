import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { filter } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthFacade } from '../../store/auth/auth.facade';
import { UserRole } from '../../core/auth/auth.service';

export interface NavChild {
  label: string;
  icon: string;
  route: string;
  /** If set, only these roles see the item. Empty/undefined = all authenticated. */
  roles?: UserRole[];
}

export interface NavGroup {
  id: string;
  label: string;
  icon: string;
  route?: string;
  children?: NavChild[];
  roles?: UserRole[];
}

const ALL_STAFF: UserRole[] = [
  'SUPER_ADMIN',
  'HOSPITAL_ADMIN',
  'DOCTOR',
  'NURSE',
  'RECEPTIONIST',
  'PHARMACIST',
  'LAB_TECHNICIAN',
];

const CLINICAL_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'HOSPITAL_ADMIN',
  'DOCTOR',
  'NURSE',
  'RECEPTIONIST',
];

const ADMIN_ROLES: UserRole[] = ['SUPER_ADMIN', 'HOSPITAL_ADMIN'];

@Component({
  selector: 'mc-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthFacade);

  readonly collapsed = input(false);
  readonly toggle = output<void>();

  private readonly expanded = signal<Set<string>>(new Set(['clinical', 'diagnostics']));

  private readonly url = toSignal(
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)),
    { initialValue: null }
  );

  /** Full tree (unfiltered) */
  private readonly allGroups: NavGroup[] = [
    {
      id: 'home',
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      roles: ALL_STAFF,
    },
    {
      id: 'clinical',
      label: 'Clinical',
      icon: 'medical_services',
      roles: CLINICAL_ROLES,
      children: [
        {
          label: 'All patients',
          icon: 'personal_injury',
          route: '/patients',
          roles: CLINICAL_ROLES,
        },
        {
          label: 'Register patient',
          icon: 'person_add',
          route: '/patients/register',
          roles: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'],
        },
        {
          label: 'Appointments',
          icon: 'calendar_month',
          route: '/appointments',
          roles: CLINICAL_ROLES,
        },
        {
          label: 'Book appointment',
          icon: 'event_available',
          route: '/appointments/book',
          roles: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'RECEPTIONIST', 'NURSE'],
        },
        {
          label: 'EMR',
          icon: 'medical_information',
          route: '/emr',
          roles: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'NURSE'],
        },
        {
          label: 'Nursing',
          icon: 'health_and_safety',
          route: '/nursing',
          roles: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'NURSE', 'DOCTOR'],
        },
      ],
    },
    {
      id: 'inpatient',
      label: 'Inpatient',
      icon: 'hotel',
      roles: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'NURSE'],
      children: [
        {
          label: 'Ward & Beds',
          icon: 'hotel',
          route: '/beds',
          roles: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'NURSE'],
        },
        {
          label: 'Emergency',
          icon: 'emergency',
          route: '/emergency',
          roles: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'NURSE'],
        },
      ],
    },
    {
      id: 'diagnostics',
      label: 'Diagnostics',
      icon: 'biotech',
      roles: [
        'SUPER_ADMIN',
        'HOSPITAL_ADMIN',
        'DOCTOR',
        'NURSE',
        'PHARMACIST',
        'LAB_TECHNICIAN',
      ],
      children: [
        {
          label: 'Laboratory',
          icon: 'science',
          route: '/laboratory',
          roles: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN'],
        },
        {
          label: 'Pharmacy',
          icon: 'medication',
          route: '/pharmacy',
          roles: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'PHARMACIST'],
        },
      ],
    },
    {
      id: 'operations',
      label: 'Operations',
      icon: 'apartment',
      roles: [...ADMIN_ROLES, 'RECEPTIONIST', 'DOCTOR'],
      children: [
        {
          label: 'Billing',
          icon: 'receipt_long',
          route: '/billing',
          roles: [...ADMIN_ROLES, 'RECEPTIONIST'],
        },
        {
          label: 'Staff & Roster',
          icon: 'groups',
          route: '/staff',
          roles: ADMIN_ROLES,
        },
        {
          label: 'Reports',
          icon: 'analytics',
          route: '/reports',
          roles: [...ADMIN_ROLES, 'DOCTOR'],
        },
      ],
    },
    {
      id: 'system',
      label: 'System',
      icon: 'admin_panel_settings',
      roles: ALL_STAFF,
      children: [
        {
          label: 'Notifications',
          icon: 'notifications',
          route: '/notifications',
          roles: ALL_STAFF,
        },
        {
          label: 'Settings',
          icon: 'settings',
          route: '/settings',
          roles: ALL_STAFF,
        },
        {
          label: 'Audit log',
          icon: 'history',
          route: '/audit',
          roles: ADMIN_ROLES,
        },
      ],
    },
  ];

  /** Groups and children filtered by current user role */
  readonly navGroups = computed(() => {
    const role = this.auth.role();
    return this.allGroups
      .map((g) => {
        if (!this.allowed(role, g.roles)) return null;
        if (!g.children?.length) return g;
        const children = g.children.filter((c) => this.allowed(role, c.roles));
        if (children.length === 0 && !g.route) return null;
        return { ...g, children };
      })
      .filter((g): g is NavGroup => g != null);
  });

  readonly openIds = computed(() => {
    const set = new Set(this.expanded());
    const path = this.router.url.split('?')[0];
    this.url();
    for (const g of this.navGroups()) {
      if (g.children?.some((c) => this.routeMatches(path, c.route))) {
        set.add(g.id);
      }
    }
    return set;
  });

  readonly roleLabel = computed(() => {
    const role = this.auth.role();
    if (!role) return '';
    return role.replace(/_/g, ' ');
  });

  private allowed(role: UserRole | null | undefined, roles?: UserRole[]): boolean {
    if (!roles || roles.length === 0) return true;
    if (!role) return false;
    return roles.includes(role);
  }

  private routeMatches(path: string, route: string): boolean {
    if (path === route) return true;
    // Prefer more specific patient child over /patients prefix for "All patients"
    if (route === '/patients') {
      return path === '/patients' || (path.startsWith('/patients/') && !path.startsWith('/patients/register'));
    }
    return path.startsWith(route + '/') || path === route;
  }

  isOpen(id: string): boolean {
    return this.openIds().has(id);
  }

  isGroupActive(group: NavGroup): boolean {
    const path = this.router.url.split('?')[0];
    if (group.route && this.routeMatches(path, group.route)) return true;
    return !!group.children?.some((c) => this.routeMatches(path, c.route));
  }

  navTestId(route: string): string {
    return 'nav-' + route.split('/').filter(Boolean).join('-');
  }

  toggleGroup(id: string, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    if (this.collapsed()) return;
    this.expanded.update((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
}
