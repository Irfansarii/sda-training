import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

interface NotificationData {
  title: string;
  message: string;
  data?: any;
  sound?: string;
  badge?: number;
}

class NotificationService {
  private static instance: NotificationService;
  private isInitialized: boolean = false;

  private constructor() {
    this.initialize();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private initialize() {
    if (this.isInitialized) {
      return;
    }

    PushNotification.configure({
      onRegister: (token) => {
        console.log('Push notification token:', token);
        // Send token to server
        this.sendTokenToServer(token.token);
      },
      onNotification: (notification) => {
        console.log('Push notification received:', notification);
        this.handleNotification(notification);
      },
      onAction: (notification) => {
        console.log('Push notification action:', notification);
        this.handleNotificationAction(notification);
      },
      onRegistrationError: (error) => {
        console.error('Push notification registration error:', error);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    this.isInitialized = true;
  }

  private async sendTokenToServer(token: string) {
    try {
      // Send token to server for push notification registration
      const response = await fetch('/api/notifications/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Failed to register push notification token');
      }
    } catch (error) {
      console.error('Failed to send token to server:', error);
    }
  }

  private handleNotification(notification: any) {
    // Handle notification received
    if (notification.userInteraction) {
      // User tapped on notification
      this.handleNotificationTap(notification);
    }
  }

  private handleNotificationAction(notification: any) {
    // Handle notification action
    console.log('Notification action:', notification);
  }

  private handleNotificationTap(notification: any) {
    // Handle notification tap
    console.log('Notification tapped:', notification);
  }

  async requestPermissions() {
    return new Promise((resolve, reject) => {
      PushNotification.requestPermissions({
        alert: true,
        badge: true,
        sound: true,
      }).then((permissions) => {
        resolve(permissions);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  async getToken(): Promise<string | null> {
    return new Promise((resolve) => {
      PushNotification.getToken((token) => {
        resolve(token);
      });
    });
  }

  async sendLocalNotification(notification: NotificationData) {
    PushNotification.localNotification({
      title: notification.title,
      message: notification.message,
      data: notification.data,
      sound: notification.sound || 'default',
      badge: notification.badge,
    });
  }

  async scheduleNotification(notification: NotificationData, date: Date) {
    PushNotification.localNotificationSchedule({
      title: notification.title,
      message: notification.message,
      data: notification.data,
      sound: notification.sound || 'default',
      badge: notification.badge,
      date: date,
    });
  }

  async cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  async getDeliveredNotifications() {
    return new Promise((resolve) => {
      PushNotification.getDeliveredNotifications((notifications) => {
        resolve(notifications);
      });
    });
  }

  async removeDeliveredNotifications(identifiers: string[]) {
    PushNotification.removeDeliveredNotifications(identifiers);
  }
}

export const notificationService = NotificationService.getInstance();
