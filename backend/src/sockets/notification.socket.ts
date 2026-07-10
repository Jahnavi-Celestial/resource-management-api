import { Socket, Server } from "socket.io";
import { NotificationRepository } from "../repositories/notification.repository.ts";

const notificationRepo = new NotificationRepository();

export function registerNotificationHandlers(io: Server, socket: Socket, employeeId: number){

  socket.on("get_my_notifications", async ({ unreadOnly }: { unreadOnly: boolean }) => {
    try {
      const list = await notificationRepo.findByRecipient(employeeId, unreadOnly);
      socket.emit("notifications_list", list);
    } catch (err: any) {
      socket.emit("error_response", { action: "fetch", message: err.message });
    }
  });

  socket.on("get_unread_count", async () => {
    try {
      const count = await notificationRepo.countUnread(employeeId);
      socket.emit("unread_count_res", { count });
    } catch (err: any) {
      socket.emit("error_response", { action: "count", message: err.message });
    }
  });

  socket.on("mark_as_read", async ({ notificationId }: { notificationId: number }) => {
    try {
      const notification = await notificationRepo.findByIdAndRecipient(notificationId, employeeId);
      if (!notification) throw new Error("Notification not found");

      notification.isRead = true;
      await notificationRepo.saveEntity(notification);

      socket.emit("mark_as_read_success", { notificationId });

      const count = await notificationRepo.countUnread(employeeId);
      socket.emit("unread_count_res", { count });
    } catch (err: any) {
      socket.emit("error_response", { action: "mark_read", message: err.message });
    }
  });

  socket.on("mark_all_as_read", async () => {
    try {
      await notificationRepo.markAllAsRead(employeeId);
      socket.emit("mark_all_as_read_success");
      socket.emit("unread_count_res", { count: 0 });
    } catch (err: any) {
      socket.emit("error_response", { action: "mark_all_read", message: err.message });
    }
  });
}

export async function dispatchSystemNotification(
  io: Server,
  recipientId: number,
  title: string,
  message: string,
  bookingId: number,
) {
    console.log(bookingId)
  const notification = await notificationRepo.createEntity({
    recipientId,
    title,
    message,
    isRead: false,
    bookingId
  });
  
  const savedNotification = await notificationRepo.saveEntity(notification);
  const targetRoom = `employee_${recipientId}`;

  io.to(targetRoom).emit("new_notification", savedNotification);
  
  const count = await notificationRepo.countUnread(recipientId);
  io.to(targetRoom).emit("unread_count_res", { count });

  return savedNotification;
}
