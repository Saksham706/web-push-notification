<div align="center">

<img width="120" height="120" alt="PushPilot Logo" src="https://img.shields.io/badge/Web-Push-4F46E5?style=for-the-badge&logo=googlechrome&logoColor=white" />

# PUSHPILOT

### 🚀 TypeScript-Powered Web Push Notification System

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=24&duration=3000&pause=1000&color=6366F1&center=true&vCenter=true&width=900&lines=Web+Push+Notifications;React+%2B+TypeScript;Node.js+%2B+Express;VAPID+Authentication;Modern+Tailwind+CSS+Dashboard" />

<br/>

<img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react" />
<img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript" />
<img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js" />
<img src="https://img.shields.io/badge/Framework-Express-000000?style=for-the-badge&logo=express" />
<img src="https://img.shields.io/badge/Styling-Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss" />
<img src="https://img.shields.io/badge/Protocol-Web_Push-4F46E5?style=for-the-badge&logo=googlechrome" />

<br/><br/>

> ### 🔔 A Modern Web Push Notification Dashboard for Sending Real-Time Browser Notifications

</div>

---

# 🌐 Overview

<div align="center">

### 🔔 PushPilot is a full-stack Web Push Notification application built using React, TypeScript, Node.js, Express, and Tailwind CSS.

</div>

The application demonstrates how websites can request notification permission, subscribe browsers to push notifications, and send messages through browser push services.

The platform provides:

- 🔔 Browser Notification Permission
- 📡 Push Subscription Management
- 🔑 VAPID Authentication
- 📨 Custom Notification Messages
- ⚡ Web Push Delivery
- 🛠️ Service Worker Integration
- 🖱️ Notification Click Handling
- 🔕 Unsubscribe Functionality
- 🎨 Modern Responsive Dashboard
- 🔗 Frontend and Backend API Integration

---

# ✨ Core Features

<div align="center">

| 🚀 Feature | 💡 Description |
|------------|---------------|
| 🔔 Push Notifications | Send notifications to subscribed browsers |
| 📡 Browser Subscription | Request permission and create browser push subscriptions |
| 🔑 VAPID Authentication | Authenticate the application when sending push messages |
| 📨 Notification Composer | Customize notification title, message, and destination |
| 🛠️ Service Worker | Receive push events and display browser notifications |
| 🖱️ Notification Click | Open or focus the application when a notification is clicked |
| 🔕 Unsubscribe | Remove subscriptions and unsubscribe the browser |
| 🎨 Responsive Dashboard | Modern interface built with React and Tailwind CSS |
| 🧩 TypeScript | Use interfaces, types, and typed functions |
| 🔗 REST API | Connect the frontend with the Express backend |

</div>

---

# 🔔 Web Push Notification System

<div align="center">

## ⚡ Real-Time Browser Notifications

</div>

### 🔥 Features Included

- Browser notification permission handling
- Service worker registration
- Push subscription creation
- VAPID public and private key configuration
- Subscription storage on the backend
- Custom notification messages
- Push delivery through browser push services
- Notification click handling
- Browser unsubscribe functionality
- Error handling and subscription status feedback

---

# 🧠 How Web Push Works

<div align="center">

## 🚀 Notification Workflow

</div>

```text
1️⃣ User opens the website
              |
              v
2️⃣ React frontend loads
              |
              v
3️⃣ User enables notifications
              |
              v
4️⃣ Browser requests notification permission
              |
              v
5️⃣ Service worker gets registered
              |
              v
6️⃣ Frontend fetches the VAPID public key
              |
              v
7️⃣ Browser creates a push subscription
              |
              v
8️⃣ Subscription is sent to the backend
              |
              v
9️⃣ Backend stores the subscription
              |
              v
🔟 User sends a test notification
              |
              v
1️⃣1️⃣ Backend sends the push message
              |
              v
1️⃣2️⃣ Browser push service delivers it
              |
              v
1️⃣3️⃣ Service worker displays notification
