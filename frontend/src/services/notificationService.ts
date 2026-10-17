import type {
  ApiResponse,
  NotificationPayload,
  SendNotificationResult,
} from "../types/notification";

import { registerServiceWorker } from "./serviceWorkerService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

interface PublicKeyResponse {
  success: boolean;
  publicKey: string;
}

interface SubscribeResponse {
  success: boolean;
  message: string;
  subscriptionId: string;
}

function decodeVapidPublicKey(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);

  const output = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    output[i] = rawData.charCodeAt(i);
  }

  return output;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong.");
  }

  return result as T;
}

export async function subscribeToNotifications(): Promise<void> {
  if (!("Notification" in window)) {
    throw new Error("Notifications are not supported by your browser.");
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const registration = await registerServiceWorker();

  const keyResponse = await request<PublicKeyResponse>(
    "/notifications/public-key",
  );

  if (!keyResponse.publicKey) {
    throw new Error("The backend did not provide a VAPID public key.");
  }

  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    const applicationServerKey = decodeVapidPublicKey(keyResponse.publicKey);

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey as BufferSource,
    });
  }

  await request<SubscribeResponse>("/notifications/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
  });
}

export async function sendTestNotification(
  payload: NotificationPayload,
): Promise<SendNotificationResult> {
  const response = await request<ApiResponse<SendNotificationResult>>(
    "/notifications/send",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  if (!response.data) {
    throw new Error("The backend did not return notification results.");
  }

  return response.data;
}

export async function unsubscribeFromNotifications(): Promise<void> {
  const registration = await registerServiceWorker();

  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    throw new Error("This browser does not have an active push subscription.");
  }

  await request("/notifications/unsubscribe", {
    method: "POST",
    body: JSON.stringify({
      endpoint: subscription.endpoint,
    }),
  });

  await subscription.unsubscribe();
}

export async function getCurrentSubscription(): Promise<boolean> {
  const registration = await registerServiceWorker();

  const subscription = await registration.pushManager.getSubscription();

  return Boolean(subscription);
}
