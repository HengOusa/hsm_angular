export type AppNotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'critical'
  | 'lab'
  | 'pharmacy'
  | 'emergency'
  | 'billing'
  | 'roster';

export interface AppNotification {
  id: string;
  type: AppNotificationType;
  title: string;
  message: string;
  route?: string;
  read: boolean;
  createdAt: string;
  source?: string;
}

export function unreadCount(list: AppNotification[]): number {
  return list.filter((n) => !n.read).length;
}
