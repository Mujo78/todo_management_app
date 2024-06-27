export function requestForNotifications() {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

export function showNotification(name?: string) {
  if (Notification.permission === "granted") {
    new Notification("TaskMaster --> task almost finished.", {
      body: `This is a friendly reminder that your task: "${name}" is almost due. You have 15 minutes remaining to complete it.`,
      requireInteraction: true,
    });
  }
}
