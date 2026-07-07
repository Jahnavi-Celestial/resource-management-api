import { useMutation, useQuery } from "@apollo/client/react";
import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Booking } from "../../graphql/queries";
import { AuthContext } from "../../context/AuthContext";
import { ApproveBooking, CancelBooking, RejectBooking } from "../../graphql/mutations";
import "./BookingDetail.css";

const BookingDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const role = user?.role

  const [reason, setReason] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, loading, error } = useQuery(Booking, {
    variables: { bookingId: Number(id) },
    skip: !id,
  })

  const bookingData = data?.booking

  const [cancelBookingAction] = useMutation(CancelBooking)
  const [approveBookingAction] = useMutation(ApproveBooking)
  const [rejectBookingAction] = useMutation(RejectBooking)

  const handleCancelBtn = async () => {
    try {
      await cancelBookingAction({
        variables: { bookingId: Number(id) },
      })
      alert("Booking successfully cancelled.")
    } catch (err) {
      alert(err.message)
    }
  }

  const handleApproveBtn = async () => {
    try {
      await approveBookingAction({
        variables: { bookingId: Number(id) },
      })
      alert("Booking successfully approved.")
    } catch (err) {
      alert(err.message)
    }
  }

  const handleRejectBtn = async () => {
    if (!reason || !reason.trim()) {
      alert("Please provide a valid rejection reason.")
      return
    }
    try {
      await rejectBookingAction({
        variables: {
          bookingId: Number(id),
          rejectionReason: reason.trim(),
        },
      })
      setIsModalOpen(false)
      setReason("")
      alert("Booking successfully rejected.")
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <div className="bd-container bd-animate-pulse">
        <div className="bd-skeleton-header"></div>
        <div className="bd-skeleton-card"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bd-center-wrapper">
        <div className="bd-error-card">
          <h2>Failed to load booking</h2>
          <p>{error.message}</p>
          <button onClick={() => navigate(-1)} className="bd-btn bd-btn-danger">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!bookingData) {
    return (
      <div className="bd-center-wrapper text-muted">Booking not found.</div>
    )
  }

  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusClass = (status) => {
    const s = status?.toLowerCase();
    if (s === "confirmed" || s === "approved") return "bd-status-confirmed";
    if (s === "pending") return "bd-status-pending";
    if (s === "cancelled" || s === "rejected") return "bd-status-cancelled";
    return "bd-status-default"
  }

  return (
    <div className="bd-page-bg">
      <div className="bd-container">
        <header className="bd-header">
          <div className="bd-title-area">
            <button onClick={() => navigate(-1)} className="bd-back-btn">
              ← Back to Bookings
            </button>
            <h1 className="bd-main-title">Booking Details</h1>
          </div>

          {role === "EMPLOYEE" && (
            <div className="bd-action-buttons">
              <button
                className="bd-btn bd-btn-secondary"
                onClick={handleCancelBtn}
              >
                Cancel Booking
              </button>
            </div>
          )}

          {role === "MANAGER" && (
            <div className="bd-action-buttons">
              <button
                className="bd-btn bd-btn-primary"
                onClick={handleApproveBtn}
              >
                Approve Booking
              </button>
              <button
                className="bd-btn bd-btn-secondary"
                onClick={() => setIsModalOpen(true)}
              >
                Reject Booking
              </button>
            </div>
          )}
        </header>

        <div className="bd-grid">
          <main className="bd-main-col">
            <div className="bd-card">
              <div className="bd-card-top">
                <span
                  className={`bd-status-badge ${getStatusClass(bookingData.status)}`}
                >
                  {bookingData.status || "Unknown"}
                </span>
                <span className="bd-meta-id">ID: #{bookingData.id}</span>
              </div>

              <h2 className="bd-purpose-title">
                {bookingData.purpose || "No Purpose Provided"}
              </h2>

              <div className="bd-split-info">
                <div className="bd-info-block">
                  <div className="bd-icon-box icon-blue">📅</div>
                  <div>
                    <h3>Date & Time</h3>
                    <p className="bd-highlight-text">
                      {formatDate(bookingData.startTime)}
                    </p>
                    <p className="bd-sub-text">
                      {formatTime(bookingData.startTime)} —{" "}
                      {formatTime(bookingData.endTime)}
                    </p>
                  </div>
                </div>

                <div className="bd-info-block">
                  <div className="bd-icon-box icon-purple">🏢</div>
                  <div>
                    <h3>Location Room</h3>
                    <p className="bd-highlight-text">
                      {bookingData.meetingRoom?.name || "Unassigned Room"}
                    </p>
                    <p className="bd-sub-text">
                      Room ID: {bookingData.meetingRoomId}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bd-equipment-section">
                <h3>Reserved Equipment</h3>
                {bookingData.equipments && bookingData.equipments.length > 0 ? (
                  <div className="bd-chip-group">
                    {bookingData.equipments.map((equip) => (
                      <span key={equip.id} className="bd-chip">
                        {equip.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="bd-no-data-text">
                    No equipment requested for this session.
                  </p>
                )}
              </div>
            </div>
          </main>

          <aside className="bd-sidebar-col">
            <div className="bd-card">
              <h3 className="bd-sidebar-title">Organizer</h3>
              <div className="bd-profile-row">
                <div className="bd-avatar">
                  {bookingData.employee?.firstName?.[0] || "U"}
                </div>
                <div>
                  <p className="bd-profile-name">
                    {bookingData.employee
                      ? `${bookingData.employee.firstName} ${bookingData.employee.lastName}`
                      : "Unknown Employee"}
                  </p>
                  <p className="bd-sub-text">ID: {bookingData.employeeId}</p>
                </div>
              </div>
            </div>

            <div className="bd-card">
              <h3 className="bd-sidebar-title">Attendance Capacity</h3>
              <div className="bd-metric-row">
                <span className="bd-metric-number">
                  {bookingData.numberOfAttendees || 0}
                </span>
                <span className="bd-metric-label">Expected Seats</span>
              </div>
            </div>

            <div className="bd-logs-panel">
              <p>Created: {new Date(bookingData.createdAt).toLocaleString()}</p>
              <p>Updated: {new Date(bookingData.updatedAt).toLocaleString()}</p>
            </div>
          </aside>
        </div>
      </div>

      {isModalOpen && (
        <div className="bd-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="bd-modal-window" onClick={(e) => e.stopPropagation()}>
            <h2 className="bd-modal-title">Reason for Booking Rejection</h2>
            <p className="bd-modal-description">
              Please explain why this schedule reservation is being denied.
            </p>

            <textarea
              placeholder="State your rejection reasoning here..."
              rows={4}
              className="bd-modal-textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="bd-modal-actions">
              <button
                className="bd-modal-btn btn-close"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bd-modal-btn btn-submit"
                onClick={() => handleRejectBtn()}
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingDetail