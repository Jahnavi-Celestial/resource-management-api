import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CreateEmployee from "./Employee/CreateEmployee";
import CreateEquipment from "./Equipment/CreateEquipment";
import CreateRoom from "./Room/CreateRoom";
import CreateBooking from "./Booking/CreateBooking";
import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { socket } from "../socket";

const NavBar = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const role = user?.role

  const [activeModal, setActiveModal] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)

  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    socket.emit("get_unread_count")

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

  const openModal = (modalName) => {
    setActiveModal(modalName)
    setIsMenuOpen(false)
    setIsNotifOpen(false)
  }

  const closeModal = () => setActiveModal(null)
  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    setIsNotifOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/";
  }

  const handleNotifClick = (notif) => {
    console.log(notif)
    if (!notif.isRead) {
      socket.emit("mark_as_read", { notificationId: notif.id })
    }
    setIsNotifOpen(false)
    
    if (notif.message?.includes("booking") || notif.title?.toLowerCase().includes("booking")) {
      let id = notif.bookingId
      navigate(`/bookingDetails/${id}`)
    }
  }

  const handleMarkAllAllRead = () => {
    socket.emit("mark_all_as_read")
    setIsNotifOpen(false)
  }

  return (
    <nav className="navbar-element">
      <div className="navbar-logo" onClick={() => navigate("/home")}>
        ResourceHub
      </div>

      <div className="navbar-right-section">
        <div className="notification-bell-container">
          <button className="bell-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
            <FontAwesomeIcon icon={faBell} />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          
          {isNotifOpen && (
            <div className="notification-panel">
              <div className="panel-header">
                <h3>Notifications</h3>
                <button onClick={handleMarkAllAllRead}>Mark all as read</button>
              </div>
              <div className="panel-body">
                {notifications.length === 0 ? (
                  <p className="empty-msg">No notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`notif-item ${!notif.isRead ? "unread" : ""}`} 
                      onClick={() => handleNotifClick(notif)}
                    >
                      <h4>{notif.title}</h4>
                      <p>{notif.message}</p>
                      <span className="notif-time">
                        {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : ""}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button className={`mobile-menu-toggle ${isMenuOpen ? "open" : ""}`} onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`navbar-menu-links ${isMenuOpen ? "display-drawer" : ""}`}>
        <NavLink to="/home" className={({ isActive }) => `nav-item-link ${isActive ? "active" : ""}`} onClick={() => setIsMenuOpen(false)}>
          Home
        </NavLink>
        <NavLink to="/room" className={({ isActive }) => `nav-item-link ${isActive ? "active" : ""}`} onClick={() => setIsMenuOpen(false)}>
          Meeting Rooms
        </NavLink>
        <NavLink to="/equipment" className={({ isActive }) => `nav-item-link ${isActive ? "active" : ""}`} onClick={() => setIsMenuOpen(false)}>
          Equipment
        </NavLink>

        {role === "ADMIN" && (
          <div className="role-actions-group">
            <button className="nav-action-btn" onClick={() => openModal("employee")}>+ Employee</button>
            <button className="nav-action-btn" onClick={() => openModal("equipment")}>+ Equipment</button>
            <button className="nav-action-btn" onClick={() => openModal("room")}>+ Room</button>
          </div>
        )}

        {role === "EMPLOYEE" && (
          <div className="role-actions-group">
            <button className="nav-action-btn primary-action" onClick={() => openModal("booking")}>Book a Room</button>
          </div>
        )}

        <button className="nav-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>✕</button>

            {activeModal === "employee" && <CreateEmployee onSubmitSuccess={closeModal} />}
            {activeModal === "equipment" && <CreateEquipment onSubmitSuccess={closeModal} />}
            {activeModal === "room" && <CreateRoom onSubmitSuccess={closeModal} />}
            {activeModal === "booking" && <CreateBooking onSubmitSuccess={closeModal} />}
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar
