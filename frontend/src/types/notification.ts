export interface NotificationPayload{
          title: string;
          message: string;
          url?: string;
}

export interface ApiResponse<T>{
          success: boolean;
          message: string;
          data?:T;
}

export interface SendNotificationResult {
          sent: number;
          failed: number;
}

export type SubscriptionStatus = 
| "checking"
| "subscribed"
| "unsubscribed"
| "unsupported";