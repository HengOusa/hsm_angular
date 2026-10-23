// Components
export { StatCardComponent } from './components/stat-card/stat-card.component';
export type { StatCardColor } from './components/stat-card/stat-card.component';

export { StatusBadgeComponent } from './components/status-badge/status-badge.component';
export type { StatusVariant } from './components/status-badge/status-badge.component';

export { PageHeaderComponent } from './components/page-header/page-header.component';

export { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
export type { ConfirmDialogData } from './components/confirm-dialog/confirm-dialog.component';

export { SearchBarComponent } from './components/search-bar/search-bar.component';

export { LoadingSkeletonComponent } from './components/loading-skeleton/loading-skeleton.component';
export type { SkeletonVariant } from './components/loading-skeleton/loading-skeleton.component';

export { EmptyStateComponent } from './components/empty-state/empty-state.component';

export { AlertBannerComponent } from './components/alert-banner/alert-banner.component';
export type { AlertVariant } from './components/alert-banner/alert-banner.component';

export { TimelineComponent } from './components/timeline/timeline.component';
export type { TimelineItem } from './components/timeline/timeline.component';

export { DataTableComponent } from './components/data-table/data-table.component';
export type { DataTableColumn } from './components/data-table/data-table.component';

export { VitalChartComponent } from './components/vital-chart/vital-chart.component';
export type { VitalPoint } from './components/vital-chart/vital-chart.component';

// Directives
export { HasPermissionDirective } from './directives/has-permission.directive';
export { HasRoleDirective } from './directives/has-role.directive';
export { AutoFocusDirective } from './directives/auto-focus.directive';
export { ClickOutsideDirective } from './directives/click-outside.directive';

// Pipes
export { AgePipe } from './pipes/age.pipe';
export { BloodGroupPipe } from './pipes/blood-group.pipe';
export { MedicalCodePipe } from './pipes/medical-code.pipe';
export { TimeAgoPipe } from './pipes/time-ago.pipe';

// Validators
export {
  bloodGroupValidator,
  mrnValidator,
  phoneValidator,
  systolicBpValidator,
  diastolicBpValidator,
  heartRateValidator,
  temperatureValidator,
  spo2Validator,
  painScaleValidator,
  icd10Validator,
} from './validators/medical.validators';

export {
  dateRangeValidator,
  notFutureDateValidator,
  pastDateValidator,
} from './validators/date-range.validator';

export { ConfirmDialogService } from './services/confirm-dialog.service';
