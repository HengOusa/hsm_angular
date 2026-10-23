import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mc-emergency',
  standalone: true,
  template: `
    <div data-test="emergency-page">
      <h1 class="mc-h1">Emergency Department</h1>
      <p class="mc-text-secondary">Triage board and code blue will be built in Module 12.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmergencyComponent {}
