import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import CreateEmployee from "./Employee/CreateEmployee";
import CreateEquipment from "./Equipment/CreateEquipment";
import CreateRoom from "./Room/CreateRoom";
import CreateBooking from "./Booking/CreateBooking";
import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../hooks/useAuth";
import { useDialog } from "../hooks/useDialog";
import { useNotification } from "../hooks/useNotification";
import { usePermission } from "../hooks/usePermission";
import { Can } from "./Can";

const NavBar = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const roles = user?.roles

  const { hasPermission } = usePermission()

  const { isOpen, dialogData: activeModal, openDialog, closeDialog } = useDialog()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const {
    isNotifOpen,
    unreadCount,
    notifications,
    toggleNotifPanel,
    closeNotifPanel,
    handleNotifClick,
    handleMarkAllAsRead
  } = useNotification()

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    setIsNotifOpen(false)
  }

  const handleOpenModal = (modalName) => {
    openDialog(modalName)
    setIsMenuOpen(false)
    setIsNotifOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/";
  }

  return (
    <nav className="navbar-element">
      <div className="navbar-logo" onClick={() => navigate("/home")}>
        ResourceHub
      </div>

      <div className="navbar-right-section">
        <div className="notification-bell-container">
          <button className="bell-btn" onClick={toggleNotifPanel}>
            <FontAwesomeIcon icon={faBell} />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          
          {isNotifOpen && (
            <div className="notification-panel">
              <div className="panel-header">
                <h3>Notifications</h3>
                <button onClick={handleMarkAllAsRead}>Mark all as read</button>
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

        {roles?.includes('admin') && (
          <div className="role-actions-group">
            <NavLink to="/admin/actions" 
              className={({ isActive }) => `nav-item-link ${isActive ? "active" : ""}`} 
              onClick={() => setIsMenuOpen(false)}
              style={{paddingTop: "5px"}}
            >
              Manage Role/Permission
            </NavLink>
            <button className="nav-action-btn" onClick={() => handleOpenModal("employee")}>+ Employee</button>
            <button className="nav-action-btn" onClick={() => handleOpenModal("equipment")}>+ Equipment</button>
            <button className="nav-action-btn" onClick={() => handleOpenModal("room")}>+ Room</button>
          </div>
        )}

        <Can permission={'CREATE_BOOKING'}>
          <div className="role-actions-group">
            <button className="nav-action-btn primary-action" onClick={() => handleOpenModal("booking")}>Book a Room</button>
          </div>
        </Can>

        <button className="nav-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {isOpen && (
        <div className="modal-overlay" onClick={closeDialog}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeDialog}>✕</button>

            {activeModal === "employee" && <CreateEmployee onSubmitSuccess={closeDialog} />}
            {activeModal === "equipment" && <CreateEquipment onSubmitSuccess={closeDialog} />}
            {activeModal === "room" && <CreateRoom onSubmitSuccess={closeDialog} />}
            {activeModal === "booking" && <CreateBooking onSubmitSuccess={closeDialog} />}
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar
