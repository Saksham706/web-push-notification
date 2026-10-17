self.addEventListener("push", (event) => {
  let data = {
    title: "Web Push Notification",
    message: "You received a new notification.",
    url: "/",
  };

  if (event.data) {
    try {
      data = {
        ...data,
        ...event.data.json(),
      };
    } catch (error) {
      console.error("Could not parse push notification data:", error);
    }
  }

  const options = {
    body: data.message,
    icon: "/notification-icon.png",
    badge: "/notification-badge.png",
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || "/",
    self.location.origin,
  );

  if (targetUrl.origin !== self.location.origin) {
    return;
  }

  event.waitUntil(
    self.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            return client.navigate(targetUrl.href).then(() => client.focus());
          }
        }

        return self.clients.openWindow(targetUrl.href);
      }),
  );
});
