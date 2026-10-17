import type {PushSubscription} from "web-push";

export interface NotificationPayload {
          title: string;
          message: string;
          url?: string; // url is optional URL to open when the user clicks the notification
} 

export interface StoredSubscription{
          id: string;
          subscription: PushSubscription;
}