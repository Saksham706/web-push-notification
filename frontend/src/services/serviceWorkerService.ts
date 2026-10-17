export async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Your browser does not support service workers.");
  }

  const registration = await navigator.serviceWorker.register(
    "/notification-sw.js",
  );

  await navigator.serviceWorker.ready;

  return registration;
}

export function isPushSupported(): boolean {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}
