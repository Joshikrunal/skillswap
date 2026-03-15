import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  text: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toast = signal<ToastMessage | null>(null);

  show(text: string, type: ToastType = 'info'): void {
    this.toast.set({ text, type });
    setTimeout(() => this.toast.set(null), 3000);
  }
}
