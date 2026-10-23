import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonVariant = 'text' | 'card' | 'avatar' | 'table-row' | 'stat';

@Component({
  selector: 'mc-loading-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="mc-skeleton-wrap"
      [attr.data-test]="testId()"
      [attr.aria-busy]="true"
      aria-label="Loading"
    >
      @switch (variant()) {
        @case ('text') {
          <div class="mc-skeleton mc-skeleton--text" [style.width]="width()"></div>
        }
        @case ('avatar') {
          <div class="mc-skeleton mc-skeleton--avatar"></div>
        }
        @case ('card') {
          <div class="mc-skeleton-card">
            <div class="mc-skeleton mc-skeleton--avatar"></div>
            <div class="mc-skeleton-card__lines">
              <div class="mc-skeleton mc-skeleton--text" style="width: 70%"></div>
              <div class="mc-skeleton mc-skeleton--text" style="width: 50%"></div>
            </div>
          </div>
        }
        @case ('stat') {
          <div class="mc-skeleton-stat">
            <div class="mc-skeleton mc-skeleton--icon"></div>
            <div class="mc-skeleton-stat__lines">
              <div class="mc-skeleton mc-skeleton--text" style="width: 60%"></div>
              <div class="mc-skeleton mc-skeleton--value"></div>
            </div>
          </div>
        }
        @case ('table-row') {
          <div class="mc-skeleton-row">
            @for (i of cols; track i) {
              <div class="mc-skeleton mc-skeleton--text" [style.width.%]="100 / count()"></div>
            }
          </div>
        }
      }
      @if (count() > 1 && variant() !== 'table-row') {
        @for (i of extra; track i) {
          <div class="mc-skeleton mc-skeleton--text" [style.width]="width()" style="margin-top: 0.5rem"></div>
        }
      }
    </div>
  `,
  styles: [
    `
      .mc-skeleton-wrap {
        width: 100%;
      }
      .mc-skeleton--text {
        height: 14px;
        border-radius: var(--mc-radius-sm);
      }
      .mc-skeleton--value {
        height: 24px;
        width: 40%;
        border-radius: var(--mc-radius-sm);
        margin-top: 4px;
      }
      .mc-skeleton--avatar {
        width: 40px;
        height: 40px;
        border-radius: var(--mc-radius-full);
        flex-shrink: 0;
      }
      .mc-skeleton--icon {
        width: 44px;
        height: 44px;
        border-radius: var(--mc-radius-md);
        flex-shrink: 0;
      }
      .mc-skeleton-card {
        display: flex;
        gap: var(--mc-space-3);
        align-items: center;
      }
      .mc-skeleton-card__lines {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .mc-skeleton-stat {
        display: flex;
        gap: var(--mc-space-3);
        padding: var(--mc-space-4);
        background: var(--mc-surface);
        border: 1px solid var(--mc-border);
        border-radius: var(--mc-radius-lg);
      }
      .mc-skeleton-stat__lines {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .mc-skeleton-row {
        display: flex;
        gap: var(--mc-space-4);
        padding: var(--mc-space-3) 0;
        border-bottom: 1px solid var(--mc-divider);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSkeletonComponent {
  readonly variant = input<SkeletonVariant>('text');
  readonly width = input('100%');
  readonly count = input(1);
  readonly testId = input('loading-skeleton');

  get cols(): number[] {
    return Array.from({ length: Math.min(this.count(), 6) }, (_, i) => i);
  }

  get extra(): number[] {
    return Array.from({ length: Math.max(0, this.count() - 1) }, (_, i) => i);
  }
}
