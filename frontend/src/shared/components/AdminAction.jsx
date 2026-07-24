import React, { lazy, Suspense, useState } from "react";
import "./AdminAction.css";
import { useDialog } from "../hooks/useDialog";
import { Can } from "./Can";

const CreateRoleModal = lazy(() => import("../../features/Role/components/CreateRoleModal"));
const UpdateRoleModal = lazy(() => import("../../features/Role/components/UpdateRoleModal"));
const CreatePermissionModal = lazy(() => import("../../features/Permission/components/CreatePermissionModal"));
const UpdatePermissionModal = lazy(() => import("../../features/Permission/components/UpdatePermissionModal"));
const DeleteRoleOrPermissionModal = lazy(() => import("../../features/Role/components/DeleteRoleOrPermission"));
const PermissionActionModal = lazy(() => import("../../features/Permission/components/PermissionActionModal"));

const AdminAction = () => {
  const [activeTab, setActiveTab] = useState("roles");

  const {
    isOpen,
    dialogData: activeModal,
    openDialog,
    closeDialog,
  } = useDialog();

  return (
    <div className="admin-settings-container">
      <aside className="admin-sidebar">
        <h2>Admin Management</h2>
        <button
          className={`tab-btn ${activeTab === "roles" ? "active" : ""}`}
          onClick={() => setActiveTab("roles")}
        >
          Manage Roles
        </button>
        <button
          className={`tab-btn ${activeTab === "permissions" ? "active" : ""}`}
          onClick={() => setActiveTab("permissions")}
        >
          Manage Permissions
        </button>
      </aside>

      <main className="admin-content-area">
        {activeTab === "roles" && (
          <div className="management-grid">
            <Can permission={'CREATE_ROLE'}>
            <div
              className="action-card"
              onClick={() => openDialog("createRole")}
            >
              <h3>Create Role</h3>
              <p>Add a new structural role to the system.</p>
            </div>
            </Can>
            <Can permission={'UPDATE_ROLE'}>
            <div
              className="action-card"
              onClick={() => openDialog("updateRole")}
            >
              <h3>Update Role</h3>
              <p>Modify names of existing user roles.</p>
            </div>
            </Can>
            <Can permission={'DELETE_ROLE'}>
            <div
              className="action-card danger-card"
              onClick={() => openDialog("deleteRole")}
            >
              <h3>Delete Role</h3>
              <p>Permanently remove a role from the system.</p>
            </div>
            </Can>
          </div>
        )}

        {activeTab === "permissions" && (
          <div className="management-grid">
            <Can permission={'CREATE_PERMISSION'}>
            <div
              className="action-card"
              onClick={() => openDialog("createPermission")}
            >
              <h3>Create Permission</h3>
              <p>Define new granular action access rules.</p>
            </div>
            </Can>
            <Can permission={'UPDATE_PERMISSION'}>
            <div
              className="action-card"
              onClick={() => openDialog("updatePermission")}
            >
              <h3>Update Permission</h3>
              <p>Modify existing authorization rules.</p>
            </div>
            </Can>
            <Can permission={'ASSIGN_PERMISSION'}>
              <div
              className="action-card"
              onClick={() => openDialog("assignPermission")}
            >
              <h3>Assign Permission</h3>
              <p>Assign Permissions to roles.</p>
            </div>      
            </Can>
            <Can permission={'REMOVE_PERMISSION'}>
              <div
              className="action-card"
              onClick={() => openDialog("removePermission")}
            >
              <h3>Remove Permission</h3>
              <p>Remove Permissions from any role.</p>
            </div>      
            </Can>
            <Can permission={'DELETE_PERMISSION'}>
            <div
              className="action-card danger-card"
              onClick={() => openDialog("deletePermission")}
            >
              <h3>Delete Permission</h3>
              <p>Permanently wipe access privileges.</p>
            </div>
            </Can>
          </div>
        )}
      </main>

      {isOpen && (
        <div className="modal-overlay" onClick={closeDialog}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeDialog}>
              ✕
            </button>

            <Suspense fallback={<div className="modal-loading">Loading form...</div>}>
            {activeModal === "createRole" && (
              <CreateRoleModal onSubmitSuccess={closeDialog} />
            )}
            {activeModal === "updateRole" && (
              <UpdateRoleModal onSubmitSuccess={closeDialog} />
            )}
            {activeModal === "createPermission" && (
              <CreatePermissionModal onSubmitSuccess={closeDialog} />
            )}
            {activeModal === "updatePermission" && (
              <UpdatePermissionModal onSubmitSuccess={closeDialog} />
            )}
            {activeModal === "deleteRole" && (
              <DeleteRoleOrPermissionModal
                type="role"
                onSubmitSuccess={closeDialog}
              />
            )}
            {activeModal === "deletePermission" && (
              <DeleteRoleOrPermissionModal
                type="permission"
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
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAction;
