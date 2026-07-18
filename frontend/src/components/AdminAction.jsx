import React, { useState } from 'react';
import CreateRoleModal from './modals/CreateRoleModal';
import UpdateRoleModal from './modals/UpdateRoleModal';
import DeleteRoleOrPermissionModal from './modals/DeleteRoleOrPermission';
import CreatePermissionModal from './modals/CreatePermissionModal';
import UpdatePermissionModal from './modals/UpdatePermissionModal';
import './AdminAction.css'; 

const AdminAction = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  return (
    <div className="admin-settings-container">
      <aside className="admin-sidebar">
        <h2>Admin Management</h2>
        <button 
          className={`tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          Manage Roles
        </button>
        <button 
          className={`tab-btn ${activeTab === 'permissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('permissions')}
        >
          Manage Permissions
        </button>
      </aside>

      <main className="admin-content-area">
        {activeTab === 'roles' && (
          <div className="management-grid">
            <div className="action-card" onClick={() => openModal("createRole")}>
              <h3>Create Role</h3>
              <p>Add a new structural role to the system.</p>
            </div>
            <div className="action-card" onClick={() => openModal("updateRole")}>
              <h3>Update Role</h3>
              <p>Modify names of existing user roles.</p>
            </div>
            <div className="action-card danger-card" onClick={() => openModal("deleteRole")}>
              <h3>Delete Role</h3>
              <p>Permanently remove a role from the system.</p>
            </div>
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="management-grid">
            <div className="action-card" onClick={() => openModal("createPermission")}>
              <h3>Create Permission</h3>
              <p>Define new granular action access rules.</p>
            </div>
            <div className="action-card" onClick={() => openModal("updatePermission")}>
              <h3>Update Permission</h3>
              <p>Modify existing authorization rules.</p>
            </div>
            <div className="action-card danger-card" onClick={() => openModal("deletePermission")}>
              <h3>Delete Permission</h3>
              <p>Permanently wipe access privileges.</p>
            </div>
          </div>
        )}
      </main>

      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>✕</button>

            {activeModal === "createRole" && <CreateRoleModal onSubmitSuccess={closeModal} />}
            {activeModal === "updateRole" && <UpdateRoleModal onSubmitSuccess={closeModal} />}
            {activeModal === "createPermission" && <CreatePermissionModal onSubmitSuccess={closeModal} />}
            {activeModal === "updatePermission" && <UpdatePermissionModal onSubmitSuccess={closeModal} />}
            {activeModal === "deleteRole" && <DeleteRoleOrPermissionModal type="role" onSubmitSuccess={closeModal} />}
            {activeModal === "deletePermission" && <DeleteRoleOrPermissionModal type="permission" onSubmitSuccess={closeModal} />}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAction
