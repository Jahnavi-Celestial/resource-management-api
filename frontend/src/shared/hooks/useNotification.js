import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../services/socket";

export const useNotification = () => {
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.emit("get_unread_count");
    socket.emit("get_my_notifications", { unreadOnly: false })

    socket.on("unread_count_res", (data) => {
      setUnreadCount(data.count)
    })

    socket.on("notifications_list", (list) => {
      setNotifications(list)
    })

    socket.on("new_notification", (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev])
    })

    socket.on("mark_as_read_success", ({ notificationId }) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      )
    })

    socket.on("mark_all_as_read_success", () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    })

    return () => {
      socket.off("unread_count_res")
      socket.off("notifications_list")
      socket.off("new_notification")
      socket.off("mark_as_read_success")
      socket.off("mark_all_as_read_success")
    }
  }, [])

  const toggleNotifPanel = () => {
    setIsNotifOpen((prev) => !prev)
  }

  const closeNotifPanel = () => {
    setIsNotifOpen(false)
  }

  const handleNotifClick = (notif) => {
    if (!notif.isRead) {
      socket.emit("mark_as_read", { notificationId: notif.id })
    }
    setIsNotifOpen(false)

    const isBooking = notif.message?.toLowerCase().includes("booking") || notif.title?.toLowerCase().includes("booking")

    if (isBooking && notif.bookingId) {
      navigate(`/bookingDetails/${notif.bookingId}`)
    }
  }

  const handleMarkAllAsRead = () => {
    socket.emit("mark_all_as_read")
    setIsNotifOpen(false)
  }

  return {
    isNotifOpen,
    unreadCount,
    notifications,
    toggleNotifPanel,
    closeNotifPanel,
    handleNotifClick,
    handleMarkAllAsRead,
  }
}
