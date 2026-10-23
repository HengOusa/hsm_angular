export interface UserPreferences {
  defaultLanding: string;
  density: 'comfortable' | 'compact';
  language: 'en' | 'ar' | 'fr';
  soundAlerts: boolean;
  desktopNotifications: boolean;
  criticalLabPopup: boolean;
  sessionWarningMinutes: number;
  dateFormat: 'MDY' | 'DMY' | 'YMD';
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultLanding: '/dashboard',
  density: 'comfortable',
  language: 'en',
  soundAlerts: true,
  desktopNotifications: false,
  criticalLabPopup: true,
  sessionWarningMinutes: 2,
  dateFormat: 'YMD',
};
