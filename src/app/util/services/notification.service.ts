import { Injectable, signal } from '@angular/core';

export interface Notification {
  message: string;
  type: 'error' | 'warning' | 'success' | 'info';
  delay?: number;
}

type UntypedNotification = Omit<Partial<Notification>, 'type'> & {
  message: Notification['message'];
};

type NotificationArguments = UntypedNotification & {
  type: Notification['type'];
};

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly DEFAULT_DELAY = 5000;

  public readonly notifications = signal<(Notification & { id: string })[]>([]);

  public push(notification: NotificationArguments) {
    this.notifications.set([
      ...this.notifications(),
      { ...notification, delay: notification.delay ?? this.DEFAULT_DELAY, id: this._hash() },
    ]);
  }

  public remove(id: string) {
    this.notifications.update((notifications) => notifications.filter((n) => n.id !== id));
  }

  private _hash(length = 10) {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }
}
