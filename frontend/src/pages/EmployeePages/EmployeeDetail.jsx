import { useQuery } from "@apollo/client/react";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { BookingPerEmployee, Employee } from "../../graphql/queries";
import { AuthContext } from "../../context/AuthContext";
import UpdateEmployee from "../../components/Employee/UpdateEmployee";
import DeleteEmployee from "../../components/Employee/DeleteEmployee";
import "./EmployeeDetail.css";
import RoleActionForm from "../../components/Forms/RoleActionForm";
import PermissionActionForm from "../../components/Forms/PermissionActionForm";
import EmployeeDetailShimmer from "../ShimmerPages/EmployeeDetailShimmer";

const EmployeeDetail = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)

  const roles = user?.roles
  const [activeModal, setActiveModal] = useState(null)

  const openModal = (modalName) => setActiveModal(modalName)
  const closeModal = () => setActiveModal(null)

  const { data, loading } = useQuery(Employee, {
    variables: { employeeId: Number(id) }
  })
  const employee = data?.employee

  const { data: bookingsData } = useQuery(BookingPerEmployee, {
    variables: { 
      input:{
        empId: Number(id)
      }
    },
    fetchPolicy: 'network-only'
  })

  if (loading) {
    return <EmployeeDetailShimmer />
  }

  return (
    <div className="detail-container">
      <header className="detail-header">
        <div>
          <h1>Employee Profile</h1>
          <p className="detail-subtext">Manage team records and assignments</p>
        </div>
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

      { roles.includes('admin') && (
        <div className="action-header-buttons">
          <div>
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
          <div>
            <button
              className="btn-edit"
              onClick={() => openModal("assignRole")}
            >
              Assign Role
            </button>
            <button
              className="btn-delete"
              onClick={() => openModal("removeRole")}
            >
              Remove Role
            </button>
          </div>
          <div>
            <button
              className="btn-edit"
              onClick={() => openModal("assignPermission")}
            >
              Assign Permission
            </button>
            <button
              className="btn-delete"
              onClick={() => openModal("removePermission")}
            >
              Remove Permission
            </button>
          </div>
        </div>
      )}

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
            {activeModal === "assignRole" && (
              <RoleActionForm actionType="assign" userId={Number(id)} onSubmitSuccess={closeModal} />
            )}
            {activeModal === "removeRole" && (
              <RoleActionForm actionType="remove" userId={Number(id)} onSubmitSuccess={closeModal} />
            )}
            {activeModal === "assignPermission" && (
              <PermissionActionForm actionType="assign" onSubmitSuccess={closeModal} />
            )}
            {activeModal === "removePermission" && (
              <PermissionActionForm actionType="remove" onSubmitSuccess={closeModal} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeDetail