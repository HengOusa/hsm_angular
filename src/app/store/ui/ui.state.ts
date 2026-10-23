export interface UiState {
  globalLoading: boolean;
  darkMode: boolean;
  sidebarCollapsed: boolean;
}

export const initialUiState: UiState = {
  globalLoading: false,
  darkMode: false,
  sidebarCollapsed: false,
};
