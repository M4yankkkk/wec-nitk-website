# Project Demo

This document provides a demonstration of the key features of the WEC-NITK website.

## Notifications Feature

The website features a client-side notification system to keep users informed about new content. This system is designed to be non-intrusive and configurable by the user.

### How it Works

The notification system operates entirely within the user's browser. It does not require a server to send push notifications.

1.  **Content Polling:** The application periodically checks for new content from the backend (e.g., new blog posts, events). It compares the timestamps of the latest content with the timestamp of the last check.
2.  **User Preferences:** Users can configure their notification preferences to choose which types of content they want to be notified about (e.g., "Notify me about new blogs"). These preferences are stored locally in the browser's `localStorage`.
3.  **Local Notifications:** If new content is found and the user has opted-in to receive notifications for that content type, a new notification is created and stored in `localStorage`. The system keeps a list of the last 50 notifications.
4.  **Notification Storage:** All notifications and user preferences are stored in the browser's `localStorage`, meaning they persist between sessions on the same device and browser.

### How to Use

1.  **Notification FAB:** A Floating Action Button (FAB) is present on the website, indicating the presence of the notification system. If there are unread notifications, the FAB will show an indicator.
2.  **Notification Panel:** Clicking the FAB opens the Notification Panel, which has two main views:
    *   **Notifications View:** This view lists all the notifications you have received. You can clear all notifications from this view.
    *   **Preferences View:** This view allows you to manage your notification settings. You can toggle notifications on or off for different types of content.

This system ensures that users have full control over the notifications they receive and that their experience is not interrupted by unwanted alerts.

## Demo:
https://drive.google.com/file/d/1akGfT3up5L7qPySjc1ImtRoCz_a6wYB6/view?usp=sharing