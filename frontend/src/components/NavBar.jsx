import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CreateEmployee from "./Employee/CreateEmployee";
import CreateEquipment from "./Equipment/CreateEquipment";
import CreateRoom from "./Room/CreateRoom";
import CreateBooking from "./Booking/CreateBooking";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const role = user?.role

  const [activeModal, setActiveModal] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const openModal = (modalName) => {
    setActiveModal(modalName)
    setIsMenuOpen(false)
  }

  const closeModal = () => setActiveModal(null)
  const toggleMobileMenu = () => setIsMenuOpen(!isMenuOpen)

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

      <button className={`mobile-menu-toggle ${isMenuOpen ? "open" : ""}`} onClick={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>

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
