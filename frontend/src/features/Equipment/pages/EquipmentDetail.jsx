import React, { lazy, Suspense, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import "./EquipmentDetail.css";
import { useAuth } from "../../Auth/hooks/useAuth";
import { useDialog } from "../../../shared/hooks/useDialog";
import { usePermission } from "../../../shared/hooks/usePermission";
import { Equipment, EquipmentUsage } from "../graphql/queries";
import EquipmentDetailShimmer from "../components/EquipmentDetailShimmer";
import { Can } from "../../../shared/components/Can";

const UpdateEquipment = lazy(() => import("../components/UpdateEquipment"));
const DeleteEquipment = lazy(() => import("../components/DeleteEquipment"));

const EquipmentDetail = () => {
  const { id } = useParams()

  const [showUsage, setShowUsage] = useState(false)
  const { user } = useAuth()

  const roles = user?.roles

  const { isOpen, dialogData: activeModal, openDialog, closeDialog } = useDialog()

  const { hasPermission } = usePermission()
  const viewEquipmentUsage = hasPermission('VIEW_EQUIPMENT_USAGE')

  const { data, loading } = useQuery(Equipment, {
    variables: { equipmentId: Number(id) },
    fetchPolicy: 'network-only'
  })
  const equipment = data?.equipment
  const bookings = equipment?.bookings || []

  const { data: usageData } = useQuery(EquipmentUsage, {
    variables: {
      input:{
        equipId: Number(id) 
      }
    },
    fetchPolicy: 'network-only'
  })
  const equipmentUsage = usageData?.equipmentUsage

  if (loading) {
    return <EquipmentDetailShimmer />
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

        <div className="equipment-action-buttons">
          <Can permission={'UPDATE_EQUIPMENT'}>
            <button
              className="btn-asset-update"
              onClick={() => openDialog("updateEquipment")}
            >
              Update Equipment
            </button>
          </Can>
          <Can permission={'DELETE_EQUIPMENT'}>
            <button
              className="btn-asset-delete"
              onClick={() => openDialog("deleteEquipment")}
            >
              Delete Equipment
            </button>
          </Can>
        </div>
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

          {(viewEquipmentUsage) && (
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
        <div className="modal-overlay" onClick={closeDialog}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeDialog}>
              &times;
            </button>

            <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
            {activeModal === "updateEquipment" && (
              <UpdateEquipment
                onSubmitSuccess={closeDialog}
                equipment={equipment}
              />
            )}
            {activeModal === "deleteEquipment" && (
              <DeleteEquipment
                onSubmitSuccess={closeDialog}
                id={equipment?.id}
                refetch={null}
              />
            )}
            </Suspense>
          </div>
        </div>
      )}
    </div>
  )
}

export default EquipmentDetail