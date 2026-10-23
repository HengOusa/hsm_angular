import { Component, ChangeDetectionStrategy, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  StatCardComponent,
  PageHeaderComponent,
  AlertBannerComponent,
  TimelineComponent,
  type TimelineItem,
} from '../../shared';
import { PatientFacade } from '../patients/store/patient.facade';
import { AppointmentFacade } from '../appointments/store/appointment.facade';
import { BedFacade } from '../beds/store/bed.facade';
import { LabFacade } from '../laboratory/store/lab.facade';
import { EmergencyFacade } from '../emergency/store/emergency.facade';
import { BillingFacade } from '../billing/store/billing.facade';
import { PharmacyFacade } from '../pharmacy/store/pharmacy.facade';
import { StaffFacade } from '../staff/store/staff.facade';
import { NotificationFacade } from '../notifications/store/notification.facade';
import { AuditFacade } from '../audit/store/audit.facade';

@Component({
  selector: 'mc-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    StatCardComponent,
    PageHeaderComponent,
    AlertBannerComponent,
    TimelineComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly patients = inject(PatientFacade);
  private readonly appointments = inject(AppointmentFacade);
  private readonly beds = inject(BedFacade);
  private readonly lab = inject(LabFacade);
  private readonly emergency = inject(EmergencyFacade);
  private readonly billing = inject(BillingFacade);
  private readonly pharmacy = inject(PharmacyFacade);
  private readonly staff = inject(StaffFacade);
  readonly notifications = inject(NotificationFacade);
  private readonly audit = inject(AuditFacade);

  readonly bedLabel = computed(() => {
    const t = this.beds.totals();
    return `${t.available} / ${t.total}`;
  });

  readonly outstandingLabel = computed(() => {
    const n = this.billing.revenue()?.outstanding ?? 0;
    return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  });

  readonly patientTotal = this.patients.total;
  readonly bedAvailable = computed(() => this.beds.totals().available);
  readonly pendingLab = this.lab.pendingCount;
  readonly erActive = this.emergency.activeCount;
  readonly pendingRx = this.pharmacy.pendingRxCount;
  readonly todayShifts = this.staff.todayCount;
  readonly unread = this.notifications.unreadCount;
  readonly conflicts = this.staff.conflictCount;

  readonly recentActivity = computed<TimelineItem[]>(() => {
    return this.audit.entries().slice(0, 6).map((e) => ({
      id: e.id,
      title: `${e.action} · ${e.resource}`,
      subtitle: e.details,
      timestamp: e.timestamp,
      icon: this.iconFor(e.action),
      color: e.action === 'REPORT' || e.action === 'STATUS_CHANGE' ? 'alert' : 'primary',
      meta: e.userName,
    }));
  });

  readonly wards = this.beds.wards;

  ngOnInit(): void {
    this.patients.search();
    this.appointments.search();
    this.beds.load();
    this.lab.load({});
    this.emergency.load();
    this.billing.load();
    this.pharmacy.loadInventory();
    this.pharmacy.loadPrescriptions('Pending');
    this.staff.load({});
    this.notifications.load();
    this.audit.load();
  }

  private iconFor(action: string): string {
    const map: Record<string, string> = {
      LOGIN: 'login',
      REPORT: 'science',
      DISPENSE: 'medication',
      PAYMENT: 'payments',
      STATUS_CHANGE: 'sync',
      CREATE: 'add_circle',
      UPDATE: 'edit',
    };
    return map[action] ?? 'history';
  }
}
