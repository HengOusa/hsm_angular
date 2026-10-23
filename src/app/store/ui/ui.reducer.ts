import { createReducer, on } from '@ngrx/store';
import { UiActions } from './ui.actions';
import { initialUiState } from './ui.state';

export const uiReducer = createReducer(
  initialUiState,
  on(UiActions.showLoading, (s) => ({ ...s, globalLoading: true })),
  on(UiActions.hideLoading, (s) => ({ ...s, globalLoading: false })),
  on(UiActions.toggleDarkMode, (s) => ({ ...s, darkMode: !s.darkMode })),
  on(UiActions.setDarkMode, (s, { enabled }) => ({ ...s, darkMode: enabled })),
  on(UiActions.toggleSidebar, (s) => ({ ...s, sidebarCollapsed: !s.sidebarCollapsed })),
  on(UiActions.setSidebarCollapsed, (s, { collapsed }) => ({ ...s, sidebarCollapsed: collapsed }))
);
