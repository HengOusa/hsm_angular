import { Component, ChangeDetectionStrategy, input, output, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { AuthFacade } from '../../store/auth/auth.facade';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationFacade } from '../../features/notifications/store/notification.facade';
import { UiActions } from '../../store/ui/ui.actions';
import { selectDarkMode } from '../../store/ui/ui.selectors';
import { UserRole } from '../../core/auth/auth.service';

@Component({
  selector: 'mc-topbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
  private readonly auth = inject(AuthFacade);
  private readonly notify = inject(NotificationService);
  private readonly notif = inject(NotificationFacade);
  private readonly store = inject(Store);

  readonly sidebarCollapsed = input(false);
  readonly toggleSidebar = output<void>();

  readonly user = this.auth.user;
  readonly fullName = this.auth.fullName;
  readonly isLoading = this.notify.isLoading;
  readonly darkMode = this.store.selectSignal(selectDarkMode);
  readonly unreadCount = this.notif.unreadCount;

  readonly initials = computed(() => {
    const u = this.user();
    if (!u) return 'U';
    const a = u.firstName?.charAt(0) ?? '';
    const b = u.lastName?.charAt(0) ?? '';
    return (a + b).toUpperCase() || u.email?.charAt(0).toUpperCase() || 'U';
  });

  readonly roleLabel = computed(() => {
    const role = this.user()?.role;
    if (!role) return 'Guest';
    const labels: Record<UserRole, string> = {
      SUPER_ADMIN: 'Super Admin',
      HOSPITAL_ADMIN: 'Hospital Admin',
      DOCTOR: 'Doctor',
      NURSE: 'Nurse',
      RECEPTIONIST: 'Receptionist',
      PHARMACIST: 'Pharmacist',
      LAB_TECHNICIAN: 'Lab Technician',
      PATIENT: 'Patient',
    };
    return labels[role] ?? role;
  });

  onLogout(): void {
    this.auth.logout();
  }

  onSearch(): void {
    this.notify.info('Global search coming soon (Ctrl+F)');
  }

  toggleTheme(): void {
    this.store.dispatch(UiActions.toggleDarkMode());
  }

  constructor() {
    this.notif.load();
  }
}
