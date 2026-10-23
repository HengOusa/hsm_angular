import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  OnDestroy,
  effect,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { EmergencyBannerComponent } from '../emergency-banner/emergency-banner.component';
import { SessionTimeoutComponent } from '../../shared/components/session-timeout/session-timeout.component';
import { WebsocketService } from '../../core/services/websocket.service';
import { SessionTimeoutService } from '../../core/services/session-timeout.service';
import { AuthFacade } from '../../store/auth/auth.facade';
import { UiActions } from '../../store/ui/ui.actions';
import { selectSidebarCollapsed, selectDarkMode } from '../../store/ui/ui.selectors';

@Component({
  selector: 'mc-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    SidebarComponent,
    TopbarComponent,
    EmergencyBannerComponent,
    SessionTimeoutComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent implements OnInit, OnDestroy {
  private readonly ws = inject(WebsocketService);
  private readonly session = inject(SessionTimeoutService);
  private readonly store = inject(Store);
  readonly auth = inject(AuthFacade);

  readonly sidebarCollapsed = this.store.selectSignal(selectSidebarCollapsed);
  readonly darkMode = this.store.selectSignal(selectDarkMode);
  readonly emergencyActive = false; // driven by WS later

  constructor() {
    effect(() => {
      const dark = this.darkMode();
      document.documentElement.classList.toggle('dark-theme', dark);
    });
  }

  ngOnInit(): void {
    this.ws.connect();
    this.session.start();
  }

  ngOnDestroy(): void {
    this.ws.disconnect();
    this.session.stop();
  }

  toggleSidebar(): void {
    this.store.dispatch(UiActions.toggleSidebar());
  }
}
