import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  PageHeaderComponent,
  StatCardComponent,
  StatusBadgeComponent,
  LoadingSkeletonComponent,
  EmptyStateComponent,
  AlertBannerComponent,
  type StatusVariant,
} from '../../../../shared';
import { StaffFacade } from '../../store/staff.facade';
import { Shift, ShiftType, ShiftStatus } from '../../domain/staff.entity';

@Component({
  selector: 'mc-staff-roster',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    PageHeaderComponent,
    StatCardComponent,
    StatusBadgeComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent,
    AlertBannerComponent,
  ],
  templateUrl: './staff-roster.component.html',
  styleUrl: './staff-roster.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffRosterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly facade = inject(StaffFacade);

  readonly shiftTypes: ShiftType[] = ['Morning', 'Afternoon', 'Night', 'OnCall'];
  readonly departments = ['ALL', 'Emergency', 'Cardiology', 'ICU', 'Pharmacy', 'Laboratory'];

  readonly form = this.fb.nonNullable.group({
    staffId: ['', Validators.required],
    date: [new Date().toISOString().slice(0, 10), Validators.required],
    shiftType: ['Morning' as ShiftType, Validators.required],
    location: [''],
    notes: [''],
  });

  ngOnInit(): void {
    this.facade.load({});
  }

  filterDept(dept: string): void {
    this.facade.load({
      department: dept === 'ALL' ? undefined : dept,
    });
  }

  statusVariant(status: ShiftStatus): StatusVariant {
    const map: Record<ShiftStatus, StatusVariant> = {
      Scheduled: 'pending',
      Confirmed: 'confirmed',
      Completed: 'completed',
      Cancelled: 'cancelled',
      NoShow: 'abnormal',
    };
    return map[status];
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.facade.createShift({
      staffId: v.staffId,
      date: v.date,
      shiftType: v.shiftType,
      location: v.location || undefined,
      notes: v.notes || undefined,
    });
  }

  confirm(s: Shift): void {
    this.facade.confirm(s.id);
  }

  cancel(s: Shift): void {
    this.facade.cancel(s.id);
  }

  /** Group shifts by date for board view */
  dates(): string[] {
    const set = new Set(this.facade.shifts().map((s) => s.date));
    return [...set].sort();
  }

  shiftsOn(date: string): Shift[] {
    return this.facade.shifts().filter((s) => s.date === date);
  }
}
