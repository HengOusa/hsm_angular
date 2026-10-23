import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  PageHeaderComponent,
  StatCardComponent,
} from '../../../../shared';
import { PatientFacade } from '../../../patients/store/patient.facade';
import { AppointmentFacade } from '../../../appointments/store/appointment.facade';
import { BedFacade } from '../../../beds/store/bed.facade';
import { PharmacyFacade } from '../../../pharmacy/store/pharmacy.facade';
import { LabFacade } from '../../../laboratory/store/lab.facade';
import { EmergencyFacade } from '../../../emergency/store/emergency.facade';
import { BillingFacade } from '../../../billing/store/billing.facade';
import { StaffFacade } from '../../../staff/store/staff.facade';
import { NotificationFacade } from '../../../notifications/store/notification.facade';

@Component({
  selector: 'mc-reports-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent,
    StatCardComponent,
  ],
  templateUrl: './reports-dashboard.component.html',
  styleUrl: './reports-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsDashboardComponent implements OnInit {
  readonly patients = inject(PatientFacade);
  readonly appointments = inject(AppointmentFacade);
  readonly beds = inject(BedFacade);
  readonly pharmacy = inject(PharmacyFacade);
  readonly lab = inject(LabFacade);
  readonly emergency = inject(EmergencyFacade);
  readonly billing = inject(BillingFacade);
  readonly staff = inject(StaffFacade);
  readonly notifications = inject(NotificationFacade);

  ngOnInit(): void {
    this.patients.search();
    this.appointments.search();
    this.beds.load();
    this.pharmacy.loadInventory();
    this.pharmacy.loadPrescriptions('Pending');
    this.lab.load({});
    this.emergency.load();
    this.billing.load();
    this.staff.load({});
    this.notifications.load();
  }
}
