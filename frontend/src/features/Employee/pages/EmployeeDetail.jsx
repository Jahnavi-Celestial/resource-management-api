import { useQuery } from "@apollo/client/react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import UpdateEmployee from "../components/UpdateEmployee";
import DeleteEmployee from "../components/DeleteEmployee";
import RoleActionModal from "../../Role/components/RoleActionModal";
import PermissionActionModal from "../../Permission/components/PermissionActionModal";
import EmployeeDetailShimmer from "../components/EmployeeDetailShimmer";
import { useAuth } from "../../Auth/hooks/useAuth";
import { useDialog } from "../../../shared/hooks/useDialog";
import { usePermission } from "../../../shared/hooks/usePermission";
import { Can } from "../../../shared/components/Can";
import { BookingPerEmployee, Employee } from "../graphql/queries";
import "./EmployeeDetail.css";

const EmployeeDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const roles = user?.roles;

  const { hasPermission } = usePermission();

  const {
    isOpen,
    dialogData: activeModal,
    openDialog,
    closeDialog,
  } = useDialog();

  const { data, loading } = useQuery(Employee, {
    variables: { employeeId: Number(id) },
  });
  const employee = data?.employee;

  const { data: bookingsData } = useQuery(BookingPerEmployee, {
    variables: {
      input: {
        empId: Number(id),
      },
    },
    fetchPolicy: "network-only",
  });

  if (loading) {
    return <EmployeeDetailShimmer />;
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
            {employee?.firstName?.[0].toUpperCase()}
            {employee?.lastName?.[0].toUpperCase()}
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
                Bookings Made by{" "}
                {bookingsData?.bookingsPerEmployee?.employeeName || "Employee"}
              </span>
            </div>
          </div>
        </section>
      </div>

      <div className="action-header-buttons">
        <div>
          <Can permission={"UPDATE_EMPLOYEE"}>
            <button
              className="btn-edit"
              onClick={() => openDialog("updateEmployee")}
            >
              Update Profile
            </button>
          </Can>
          <Can permission={"DELETE_EMPLOYEE"}>
            <button
              className="btn-delete"
              onClick={() => openDialog("deleteEmployee")}
            >
              Delete Account
            </button>
          </Can>
        </div>

        <div>
          <Can permission={"ASSIGN_ROLE"}>
            <button
              className="btn-edit"
              onClick={() => openDialog("assignRole")}
            >
              Assign Role
            </button>
          </Can>
          <Can permission={"REMOVE_ROLE"}>
            <button
              className="btn-delete"
              onClick={() => openDialog("removeRole")}
            >
              Remove Role
            </button>
          </Can>
        </div>

        <div>
          <Can permission={"ASSIGN_PERMISSION"}>
            <button
              className="btn-edit"
              onClick={() => openDialog("assignPermission")}
            >
              Assign Permission
            </button>
          </Can>
          <Can permission={"REMOVE_PERMISSION"}>
            <button
              className="btn-delete"
              onClick={() => openDialog("removePermission")}
            >
              Remove Permission
            </button>
          </Can>
        </div>
      </div>

      {activeModal && (
        <div className="modal-overlay" onClick={closeDialog}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeDialog}>
              &times;
            </button>

            {activeModal === "updateEmployee" && (
              <UpdateEmployee
                onSubmitSuccess={closeDialog}
                employee={employee}
              />
            )}
            {activeModal === "deleteEmployee" && (
              <DeleteEmployee
                onSubmitSuccess={closeDialog}
                id={employee?.id}
                refetch={null}
              />
            )}
            {activeModal === "assignRole" && (
              <RoleActionModal
                actionType="assign"
                userId={Number(id)}
                onSubmitSuccess={closeDialog}
              />
            )}
            {activeModal === "removeRole" && (
              <RoleActionModal
                actionType="remove"
                userId={Number(id)}
                onSubmitSuccess={closeDialog}
              />
            )}
            {activeModal === "assignPermission" && (
              <PermissionActionModal
                actionType="assign"
                onSubmitSuccess={closeDialog}
              />
            )}
            {activeModal === "removePermission" && (
              <PermissionActionModal
                actionType="remove"
                onSubmitSuccess={closeDialog}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetail;
