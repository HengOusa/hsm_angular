import { Component, ChangeDetectionStrategy, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared';
import { SettingsFacade } from '../../store/settings.facade';
import { Store } from '@ngrx/store';
import { UiActions } from '../../../../store/ui/ui.actions';
import { selectDarkMode } from '../../../../store/ui/ui.selectors';

@Component({
  selector: 'mc-settings-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly facade = inject(SettingsFacade);
  private readonly store = inject(Store);

  readonly darkMode = this.store.selectSignal(selectDarkMode);

  readonly form = this.fb.nonNullable.group({
    defaultLanding: ['/dashboard', Validators.required],
    density: ['comfortable' as 'comfortable' | 'compact', Validators.required],
    language: ['en' as 'en' | 'ar' | 'fr', Validators.required],
    soundAlerts: [true],
    desktopNotifications: [false],
    criticalLabPopup: [true],
    sessionWarningMinutes: [2, [Validators.required, Validators.min(1), Validators.max(15)]],
    dateFormat: ['YMD' as 'MDY' | 'DMY' | 'YMD', Validators.required],
  });

  private synced = false;

  constructor() {
    effect(() => {
      const p = this.facade.preferences();
      if (p && !this.synced) {
        this.form.patchValue(p, { emitEvent: false });
        this.synced = true;
      }
    });
  }

  ngOnInit(): void {
    this.facade.load();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.facade.save(this.form.getRawValue());
    this.synced = true;
  }

  reset(): void {
    this.synced = false;
    this.facade.reset();
  }

  toggleTheme(): void {
    this.store.dispatch(UiActions.toggleDarkMode());
  }
}
