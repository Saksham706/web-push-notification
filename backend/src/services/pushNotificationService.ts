import webPush from "../config/webPush.js";

import type {
  NotificationPayload,
  StoredSubscription,
} from "../types/notification.js";

import type { PushSubscription } from "web-push";

const subscriptions: StoredSubscription[] = [];

export function saveSubscription(subscription: PushSubscription): string {
  const existingSubscription = subscriptions.find(
    (item) => item.subscription.endpoint === subscription.endpoint,
  );

  if (existingSubscription) {
    existingSubscription.subscription = subscription;

    return existingSubscription.id;
  }

  const id = crypto.randomUUID();

  subscriptions.push({
    id,
    subscription,
  });

  return id;
}

export function removeSubscription(endpoint: string): boolean {
  const initialLength = subscriptions.length;

  const remainingSubscriptions = subscriptions.filter(
    (item) => item.subscription.endpoint !== endpoint,
  );

  subscriptions.splice(0, subscriptions.length, ...remainingSubscriptions);

  return subscriptions.length < initialLength;
}

export async function sendNotification(payload: NotificationPayload): Promise<{
  sent: number;
  failed: number;
}> {
  let sent = 0;
  let failed = 0;

  const notificationData = JSON.stringify({
    title: payload.title,
    message: payload.message,
    url: payload.url ?? "/",
  });

  for (const item of [...subscriptions]) {
    try {
      await webPush.sendNotification(item.subscription, notificationData);

      sent++;
    } catch (error: unknown) {
      failed++;

      console.error(
        `Failed to send notification to subscription ${item.id}:`,
        error,
      );

      if (
        typeof error === "object" &&
        error !== null &&
        "statusCode" in error &&
        (error.statusCode === 404 || error.statusCode === 410)
      ) {
        removeSubscription(item.subscription.endpoint);
      }
    }
  }

  return {
    sent,
    failed,
  };
}
