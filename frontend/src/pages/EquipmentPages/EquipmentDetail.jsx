import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import UpdateEquipment from "../../components/Equipment/UpdateEquipment";
import DeleteEquipment from "../../components/Equipment/DeleteEquipment";
import { Equipment, EquipmentUsage } from "../../graphql/queries";
import { useQuery } from "@apollo/client/react";
import "./EquipmentDetail.css";

const EquipmentDetail = () => {
  const { id } = useParams()

  const [showUsage, setShowUsage] = useState(false)
  const { user } = useContext(AuthContext)
  const [activeModal, setActiveModal] = useState(null)

  const openModal = (modalName) => setActiveModal(modalName)
  const closeModal = () => setActiveModal(null)

  const role = user?.role

  const { data, loading } = useQuery(Equipment, {
    variables: { equipmentId: Number(id) },
  })
  const equipment = data?.equipment
  const bookings = equipment?.bookings || []

  const { data: usageData } = useQuery(EquipmentUsage, {
    variables: { equipId: Number(id) },
  })
  const equipmentUsage = usageData?.equipmentUsage

  if (loading) {
    return (
      <div className="detail-loading">Loading asset inventory profile...</div>
    )
  }

  return (
    <div className="equipment-detail-container">
      <header className="equipment-detail-header">
        <div>
          <h1>Equipment Details</h1>
          <p className="equipment-detail-subtext">
            Manage asset parameters, tracking logs, and storage data.
          </p>
        </div>

        {role === "ADMIN" && (
          <div className="equipment-action-buttons">
            <button
              className="btn-asset-update"
              onClick={() => openModal("updateEquipment")}
            >
              Update Equipment
            </button>
            <button
              className="btn-asset-delete"
              onClick={() => openModal("deleteEquipment")}
            >
              Delete Equipment
            </button>
          </div>
        )}
      </header>

      <div className="equipment-detail-layout">
        <section className="equipment-info-panel">
          <h2>{equipment?.name}</h2>
          <span
            className={`equipment-pill-status ${(equipment?.quantityAvailable || 0) > 0 ? "active" : "inactive"}`}
          >
            {(equipment?.quantityAvailable || 0) > 0
              ? "In Stock"
              : "Out of Stock"}
          </span>

          <div className="equipment-spec-list">
            <div className="spec-row-item">
              <span className="spec-label">Quantity Available</span>
              <span className="spec-value">
                {equipment?.quantityAvailable || 0} Units
              </span>
            </div>
            <div className="spec-row-item">
              <span className="spec-label">Asset Tracking ID</span>
              <span className="spec-value">#{equipment?.id}</span>
            </div>
          </div>
        </section>

        <section className="equipment-schedule-panel">
          <div className="schedule-panel-header">
            <h3>Active Booking Allocations</h3>
            <span className="schedule-counter-badge">
              {bookings.length} Sessions
            </span>
          </div>

          <div className="schedule-timeline-list">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div key={booking.id} className="timeline-booking-card">
                  <div className="timeline-card-header">
                    <h4>{booking.purpose || "Workspace Reservation"}</h4>
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
                      <strong>Room:</strong>{" "}
                      {booking.meetingRoom?.name || "Unassigned"}
                    </p>
                    <p>
                      <strong>Timeline:</strong> {booking.startTime} -{" "}
                      {booking.endTime}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-bookings-placeholder">
                This item is not allocated to any upcoming team sessions.
              </p>
            )}
          </div>

          {(role === "ADMIN" || role === "MANAGER") && (
            <div className="collapsible-section">
              <button
                className={`btn-toggle ${showUsage ? "active" : ""}`}
                onClick={() => setShowUsage(!showUsage)}
              >
                {showUsage
                  ? "Hide Utilization Reports"
                  : "View Utilization Reports"}
              </button>

              {showUsage && (
                <div className="collapsible-content">
                  <div className="statement-row">
                    <span>Registry Title:</span>
                    <strong>{equipmentUsage?.equipmentName || "N/A"}</strong>
                  </div>
                  <div className="statement-row">
                    <span>Allocation Metrics:</span>
                    <strong>
                      Used {equipmentUsage?.timesUsage || 0} times
                    </strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              &times;
            </button>

            {activeModal === "updateEquipment" && (
              <UpdateEquipment
                onSubmitSuccess={closeModal}
                equipment={equipment}
              />
            )}
            {activeModal === "deleteEquipment" && (
              <DeleteEquipment
                onSubmitSuccess={closeModal}
                id={equipment?.id}
                refetch={null}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EquipmentDetail
