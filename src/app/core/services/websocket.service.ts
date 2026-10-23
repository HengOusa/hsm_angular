import { Injectable, signal, OnDestroy, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

export type WsEventType =
  | 'patient.admitted'
  | 'patient.discharged'
  | 'bed.status.changed'
  | 'appointment.status.changed'
  | 'lab.result.ready'
  | 'lab.result.critical'
  | 'emergency.new'
  | 'emergency.code.blue'
  | 'vitals.abnormal'
  | 'medication.overdue'
  | 'doctor.status.changed'
  | 'staff.message';

export interface WsMessage<T = unknown> {
  type: WsEventType;
  payload: T;
  timestamp: string;
}

type Listener = (msg: WsMessage) => void;

/**
 * WebSocket client stub.
 * Replace with socket.io-client when backend is ready.
 */
@Injectable({ providedIn: 'root' })
export class WebsocketService implements OnDestroy {
  private readonly auth = inject(AuthService);
  private socket: WebSocket | null = null;
  private readonly listeners = new Map<WsEventType | '*', Set<Listener>>();
  private reconnectAttempts = 0;
  private readonly maxReconnect = 10;

  readonly connected = signal(false);

  connect(): void {
    if (!environment.wsUrl || this.socket?.readyState === WebSocket.OPEN) return;

    try {
      this.socket = new WebSocket(environment.wsUrl);
      this.socket.onopen = () => {
        this.connected.set(true);
        this.reconnectAttempts = 0;
      };
      this.socket.onclose = () => {
        this.connected.set(false);
        this.scheduleReconnect();
      };
      this.socket.onerror = () => {
        this.connected.set(false);
      };
      this.socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string) as WsMessage;
          this.emit(msg);
        } catch {
          // ignore malformed
        }
      };
    } catch {
      this.scheduleReconnect();
    }
  }

  disconnect(): void {
    this.socket?.close();
    this.socket = null;
    this.connected.set(false);
  }

  on(event: WsEventType | '*', listener: Listener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
    return () => this.listeners.get(event)?.delete(listener);
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.listeners.clear();
  }

  private emit(msg: WsMessage): void {
    this.listeners.get(msg.type)?.forEach((fn) => fn(msg));
    this.listeners.get('*')?.forEach((fn) => fn(msg));
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnect) return;
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
    this.reconnectAttempts++;
    setTimeout(() => this.connect(), delay);
  }
}
