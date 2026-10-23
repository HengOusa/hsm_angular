import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '../../../../shared';

@Component({
  selector: 'mc-nursing-board',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent,
  ],
  template: `
    <div class="mc-nursing" data-test="nursing-page">
      <mc-page-header
        title="Nursing"
        subtitle="Quick links for ward nurses · MAR & vitals via EMR"
        icon="health_and_safety"
      />
      <section class="mc-nursing__grid">
        <a class="mc-nursing__tile" routerLink="/beds">
          <mat-icon>hotel</mat-icon>
          <span>Bed board</span>
        </a>
        <a class="mc-nursing__tile" routerLink="/emr">
          <mat-icon>monitor_heart</mat-icon>
          <span>Vitals & SOAP</span>
        </a>
        <a class="mc-nursing__tile" routerLink="/pharmacy">
          <mat-icon>medication</mat-icon>
          <span>Meds queue</span>
        </a>
        <a class="mc-nursing__tile" routerLink="/laboratory">
          <mat-icon>science</mat-icon>
          <span>Lab results</span>
        </a>
        <a class="mc-nursing__tile" routerLink="/emergency">
          <mat-icon>emergency</mat-icon>
          <span>ER board</span>
        </a>
        <a class="mc-nursing__tile" routerLink="/notifications">
          <mat-icon>notifications</mat-icon>
          <span>Alerts</span>
        </a>
      </section>
    </div>
  `,
  styles: [
    `
      .mc-nursing {
        width: 100%;
        max-width: 100%;
      }
      .mc-nursing__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(100%, 160px), 1fr));
        gap: var(--mc-space-3);
        width: 100%;
      }
      .mc-nursing__tile {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: var(--mc-space-5);
        background: var(--mc-surface);
        border: 1px solid var(--mc-border);
        border-radius: var(--mc-radius-lg);
        text-decoration: none;
        color: var(--mc-text-primary);
        font-weight: 600;
        font-size: var(--mc-font-size-sm);
        transition: border-color var(--mc-transition-fast), box-shadow var(--mc-transition-fast);
      }
      .mc-nursing__tile:hover {
        border-color: var(--mc-primary-300);
        box-shadow: var(--mc-shadow-sm);
      }
      .mc-nursing__tile mat-icon {
        color: var(--mc-primary-800);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NursingBoardComponent {}
