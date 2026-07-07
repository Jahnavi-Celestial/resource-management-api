import React from "react";
import { useNavigate } from "react-router-dom";
import "./RoomCard.css";

const RoomCard = ({ room }) => {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/roomDetails/${room.id}`)
  }

  const totalBookings = room.bookings?.length || 0

  return (
    <div className="room-card" onClick={handleCardClick}>
      <div className="room-image-placeholder">
        <span className={`room-status-badge ${room.isActive ? "active" : "inactive"}`}>
          {room.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="room-card-body">
        <div className="room-card-header">
          <h3 className="room-title">{room.name}</h3>
          <span className="room-capacity-tag">
            {room.capacity} seats
          </span>
        </div>

        <p className="room-location-text">
          <svg className="location-pin-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {room.location}
        </p>

        <div className="room-meta-row">
          <span className="booking-count-indicator">
            {totalBookings} {totalBookings === 1 ? "Scheduled Booking" : "Scheduled Bookings"}
          </span>
        </div>
      </div>
    </div>
  )
}

export default RoomCard
