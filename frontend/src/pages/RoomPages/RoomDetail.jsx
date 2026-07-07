import { useQuery } from "@apollo/client/react";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Room } from "../../graphql/queries";
import { AuthContext } from "../../context/AuthContext";
import UpdateRoom from "../../components/Room/UpdateRoom";
import DeleteRoom from "../../components/Room/DeleteRoom";
import "./RoomDetail.css";

const RoomDetail = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const role = user?.role

  const [activeModal, setActiveModal] = useState(null)

  const openModal = (modalName) => setActiveModal(modalName)
  const closeModal = () => setActiveModal(null)

  const { data, loading } = useQuery(Room, {
    variables: { roomId: Number(id) }
  })

  const room = data?.room;
  const bookings = room?.bookings || []

  if (loading) {
    return (
      <div className="detail-loading">Loading meeting workspace specs...</div>
    )
  }

  return (
    <div className="room-detail-container">
      <header className="room-detail-header">
        <div>
          <h1>Workspace Details</h1>
          <p className="room-detail-subtext">
            Review schedule status and inventory configuration.
          </p>
        </div>

        {role === "ADMIN" && (
          <div className="room-action-buttons">
            <button
              className="btn-room-update"
              onClick={() => openModal("updateRoom")}
            >
              Update Room
            </button>
            <button
              className="btn-room-delete"
              onClick={() => openModal("deleteRoom")}
            >
              Delete Room
            </button>
          </div>
        )}
      </header>

      <div className="room-detail-layout">
        <section className="room-info-panel">
          <h2>{room?.name}</h2>
          <span
            className={`room-pill-status ${room?.isActive ? "active" : "inactive"}`}
          >
            {room?.isActive ? "Active Workspace" : "Inactive"}
          </span>
        </section>
      </div>

      <div className="room-spec-list">
        <div className="spec-row-item">
          <span className="spec-label">Location / Floor</span>
          <span className="spec-value">{room?.location}</span>
        </div>
        <div className="spec-row-item">
          <span className="spec-label">Seating Capacity</span>
          <span className="spec-value">{room?.capacity} Persons</span>
        </div>
        <div className="spec-row-item">
          <span className="spec-label">Workspace ID</span>
          <span className="spec-value">#{room?.id}</span>
        </div>
      </div>

      <section className="room-schedule-panel">
        <div className="schedule-panel-header">
          <h3>Scheduled Booking Timelines</h3>
          <span className="schedule-counter-badge">
            {bookings.length} Sessions
          </span>
        </div>

        <div className="schedule-timeline-list">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="timeline-booking-card">
                <div className="timeline-card-header">
                  <h4>{booking.purpose || "Internal Session"}</h4>
                  <span
                    className={`timeline-status-tag ${booking.status?.toLowerCase() || "pending"}`}
                  >
                    {booking.status || "Pending"}
                  </span>
                </div>

                <div className="timeline-card-details">
                  <p>
                    <strong>Host:</strong> {booking.employee?.firstName}{" "}
                    {booking.employee?.lastName}
                  </p>
                  <p>
                    <strong>Attendees:</strong> {booking.numberOfAttendees || 0}{" "}
                    Persons
                  </p>
                  <p>
                    <strong>Timeline:</strong> {booking.startTime} -{" "}
                    {booking.endTime}
                  </p>
                </div>

                {booking.equipments && booking.equipments.length > 0 && (
                  <div className="timeline-equipment-box">
                    <span className="equipment-box-label">
                      Requested Utility:
                    </span>
                    <div className="equipment-pills-row">
                      {booking.equipments.map((eq) => (
                        <span key={eq.id} className="eq-item-pill">
                          {eq.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="no-bookings-placeholder">
              No team sessions currently scheduled for this workspace.
            </p>
          )}
        </div>
      </section>

      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              &times;
            </button>

            {activeModal === "updateRoom" && (
              <UpdateRoom onSubmitSuccess={closeModal} room={room} />
            )}
            {activeModal === "deleteRoom" && (
              <DeleteRoom
                onSubmitSuccess={closeModal}
                id={room?.id}
                refetch={null}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomDetail
