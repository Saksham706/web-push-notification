import { Router } from "express";

import {
  saveSubscription,
  removeSubscription,
  sendNotification,
} from "../services/pushNotificationService.js";

import { getPublicKey,} from "../controllers/notificationController.js"
const router = Router();

// Save a browser's push subscription
router.post("/subscribe", (req, res) => {
  try {
    const subscription = req.body;

    if (
      !subscription ||
      typeof subscription.endpoint !== "string" ||
      !subscription.keys ||
      typeof subscription.keys.p256dh !== "string" ||
      typeof subscription.keys.auth !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "A valid push subscription is required.",
      });
      return;
    }

    const subscriptionId = saveSubscription(subscription);

    res.status(201).json({
      success: true,
      message: "Subscription saved successfully.",
      subscriptionId,
    });
  } catch (error: unknown) {
    console.error("Error saving subscription:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save subscription.",
    });
  }
});

// Send a push notification to subscribed browsers
router.post("/send", async (req, res) => {
  try {
    const { title, message, url } = req.body;

    if (
      typeof title !== "string" ||
      typeof message !== "string" ||
      (url !== undefined && typeof url !== "string")
    ) {
      res.status(400).json({
        success: false,
        message: "Title and message are required. URL must be a string.",
      });
      return;
    }

    const result = await sendNotification({
      title,
      message,
      url,
    });

    res.status(200).json({
      success: true,
      message: "Notification sending process completed.",
      data: result,
    });
  } catch (error: unknown) {
    console.error("Error sending notification:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send notification.",
    });
  }
});

// Remove a browser's push subscription
router.post("/unsubscribe", (req, res) => {
  try {
    const { endpoint } = req.body;

    if (typeof endpoint !== "string" || !endpoint) {
      res.status(400).json({
        success: false,
        message: "A valid subscription endpoint is required.",
      });
      return;
    }

    const removed = removeSubscription(endpoint);

    res.status(200).json({
      success: true,
      message: removed
        ? "Subscription removed successfully."
        : "Subscription was not found.",
    });
  } catch (error: unknown) {
    console.error("Error removing subscription:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove subscription.",
    });
  }
});

router.get("/public-key", getPublicKey);
export default router;
