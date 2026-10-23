import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'mc-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="mc-empty" [attr.data-test]="testId()" role="status">
      <div class="mc-empty__icon" aria-hidden="true">
        <mat-icon>{{ icon() }}</mat-icon>
      </div>
      <h3 class="mc-h4 mc-empty__title">{{ title() }}</h3>
      @if (message()) {
        <p class="mc-empty__message">{{ message() }}</p>
      }
      <div class="mc-empty__actions">
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .mc-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: var(--mc-space-10) var(--mc-space-4);
        min-height: 200px;
      }
      .mc-empty__icon {
        width: 64px;
        height: 64px;
        border-radius: var(--mc-radius-full);
        background: var(--mc-surface-variant);
        color: var(--mc-text-disabled);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: var(--mc-space-4);
      }
      .mc-empty__icon mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
      .mc-empty__title {
        margin: 0 0 var(--mc-space-2);
        color: var(--mc-text-primary);
      }
      .mc-empty__message {
        margin: 0 0 var(--mc-space-4);
        color: var(--mc-text-secondary);
        font-size: var(--mc-font-size-sm);
        max-width: 360px;
      }
      .mc-empty__actions {
        display: flex;
        gap: var(--mc-space-2);
        flex-wrap: wrap;
        justify-content: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly message = input<string | null>(null);
  readonly icon = input('inbox');
  readonly testId = input('empty-state');
}
