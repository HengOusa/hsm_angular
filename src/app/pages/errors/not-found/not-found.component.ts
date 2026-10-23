import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'mc-not-found',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;gap:1rem;text-align:center;" data-test="not-found-page">
      <mat-icon style="font-size:64px;width:64px;height:64px;color:var(--mc-text-disabled);">search_off</mat-icon>
      <h1 class="mc-h1">Page not found</h1>
      <p class="mc-text-secondary">The page you requested does not exist.</p>
      <a mat-flat-button color="primary" routerLink="/dashboard">Go to Dashboard</a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
