import React from "react";
import { useNavigate } from "react-router-dom";
import "./BookingCard.css"; 

const BookingCard = ({ booking }) => {
  const navigate = useNavigate()

  if (!booking) return null

  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusClass = (status) => {
    const s = status?.toLowerCase()
    if (s === "confirmed" || s === "approved") 
      return "bc-status-confirmed"

    if (s === "pending") 
      return "bc-status-pending"

    if (s === "cancelled" || s === "rejected") 
      return "bc-status-cancelled"

    return "bc-status-default"
  }

  return (
    <div className="bc-card" onClick={() => navigate(`/bookingDetails/${booking.id}`)} >
      <div className="bc-card-header">
        <div className="bc-room-info">
          <span className="bc-room-icon">🏢</span>
          <h3 className="bc-room-name">
            {booking.meetingRoom?.name || "Unassigned Room"}
          </h3>
        </div>
        <span className={`bc-status-badge ${getStatusClass(booking.status)}`}>
          {booking.status || "Unknown"}
        </span>
      </div>

      <p className="bc-purpose">
        {booking.purpose || "No Purpose Provided"}
      </p>

      <div className="bc-card-footer">
        <div className="bc-meta-item">
          <span className="bc-meta-icon">👥</span>
          <span className="bc-meta-text">
            <strong>{booking.numberOfAttendees || 0}</strong> Attendees
          </span>
        </div>

        <div className="bc-meta-item bc-time-wrapper">
          <span className="bc-meta-icon">🕒</span>
          <span className="bc-meta-text bc-time-text">
            {formatDateTime(booking.startTime)} — {formatDateTime(booking.endTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
