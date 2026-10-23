import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mc-appointments',
  standalone: true,
  template: `
    <div data-test="appointments-page">
      <h1 class="mc-h1">Appointments</h1>
      <p class="mc-text-secondary">Calendar, conflict detection, and booking will be built in Module 4.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsComponent {}
