import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mc-beds',
  standalone: true,
  template: `
    <div data-test="beds-page">
      <h1 class="mc-h1">Ward & Beds</h1>
      <p class="mc-text-secondary">Live bed map and assignment will be built in Module 5.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BedsComponent {}
