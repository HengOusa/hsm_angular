import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { LoadingSkeletonComponent } from '../loading-skeleton/loading-skeleton.component';

export interface DataTableColumn<T = unknown> {
  key: string;
  header: string;
  /** Optional cell template key for custom rendering via content projection later */
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  /** Simple path accessor: supports nested keys like 'patient.name' */
  cell?: (row: T) => string | number | null | undefined;
}

@Component({
  selector: 'mc-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBarModule,
    EmptyStateComponent,
    LoadingSkeletonComponent,
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T extends object = Record<string, unknown>> {
  readonly columns = input.required<DataTableColumn<T>[]>();
  readonly data = input.required<T[]>();
  readonly loading = input(false);
  readonly total = input(0);
  readonly pageSize = input(10);
  readonly pageIndex = input(0);
  readonly emptyTitle = input('No records found');
  readonly emptyMessage = input<string | null>('Try adjusting your search or filters.');
  readonly testId = input('data-table');
  readonly trackByKey = input<keyof T | string>('id');

  readonly sortChange = output<Sort>();
  readonly pageChange = output<PageEvent>();
  readonly rowClick = output<T>();

  get displayedColumns(): string[] {
    return this.columns().map((c) => c.key);
  }

  cellValue(row: T, col: DataTableColumn<T>): string {
    if (col.cell) {
      const v = col.cell(row);
      return v == null ? '—' : String(v);
    }
    const keys = col.key.split('.');
    let val: unknown = row;
    for (const k of keys) {
      if (val == null || typeof val !== 'object') return '—';
      val = (val as Record<string, unknown>)[k];
    }
    return val == null ? '—' : String(val);
  }

  trackRow = (_: number, row: T): unknown => {
    const key = this.trackByKey();
    return (row as Record<string, unknown>)[key as string] ?? _;
  };
}
