import { useQuery } from "@apollo/client/react";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { BookingPerEmployee, Employee } from "../../graphql/queries";
import { AuthContext } from "../../context/AuthContext";
import UpdateEmployee from "../../components/Employee/UpdateEmployee";
import DeleteEmployee from "../../components/Employee/DeleteEmployee";
import "./EmployeeDetail.css";

const EmployeeDetail = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)

  const role = user?.role
  const [activeModal, setActiveModal] = useState(null)

  const openModal = (modalName) => setActiveModal(modalName)
  const closeModal = () => setActiveModal(null)

  const { data, loading } = useQuery(Employee, {
    variables: { employeeId: Number(id) }
  })
  const employee = data?.employee

  const { data: bookingsData } = useQuery(BookingPerEmployee, {
    variables: { empId: Number(id) }
  })

  if (loading) {
    return <div className="loading-state">Loading employee profile...</div>
  }

  return (
    <div className="detail-container">
      <header className="detail-header">
        <div>
          <h1>Employee Profile</h1>
          <p className="detail-subtext">Manage team records and assignments</p>
        </div>

        {role === "ADMIN" && (
          <div className="action-header-buttons">
            <button
              className="btn-edit"
              onClick={() => openModal("updateEmployee")}
            >
              Update Profile
            </button>
            <button
              className="btn-delete"
              onClick={() => openModal("deleteEmployee")}
            >
              Delete Account
            </button>
          </div>
        )}
      </header>

      <div className="detail-layout">
        <section className="profile-card">
          <div className="profile-avatar-large">
            {employee?.firstName?.[0]}
            {employee?.lastName?.[0]}
          </div>
          <h2 className="profile-name">
            {employee?.firstName} {employee?.lastName}
          </h2>
          <span className="profile-role-badge">{employee?.role}</span>

          <div className="profile-fields-list">
            <div className="field-item">
              <span className="field-label">Email Address</span>
              <span className="field-value">{employee?.email}</span>
            </div>
            <div className="field-item">
              <span className="field-label">Account Identification</span>
              <span className="field-value">#{id}</span>
            </div>
          </div>
        </section>

        <section className="metrics-card">
          <h3>Employee Bookings</h3>
          <div className="metrics-grid-single">
            <div className="metric-box single-stat">
              <span className="metric-number">
                {bookingsData?.bookingsPerEmployee?.bookingCount || 0}
              </span>
              <span className="metric-title">
                Bookings Made by {bookingsData?.bookingsPerEmployee?.employeeName || "Employee"}
              </span>
            </div>
          </div>
        </section>
      </div>

      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              &times;
            </button>

            {activeModal === "updateEmployee" && (
              <UpdateEmployee
                onSubmitSuccess={closeModal}
                employee={employee}
              />
            )}
            {activeModal === "deleteEmployee" && (
              <DeleteEmployee
                onSubmitSuccess={closeModal}
                id={employee?.id}
                refetch={null}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeDetail