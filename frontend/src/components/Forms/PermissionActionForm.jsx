import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GetAllRoles, GetAllPermission } from "../../graphql/queries";
import { AssignPermission, RemovePermission } from "../../graphql/mutations";
import "./PermissionActionForm.css"

const PermissionActionForm = ({ actionType, onSubmitSuccess }) => {
  const [selectedRoleId, setSelectedRoleId] = useState("")
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([])

  const { data: rolesData, loading: rolesLoading } = useQuery(GetAllRoles)
  const { data: permissionsData, loading: permissionsLoading } = useQuery(GetAllPermission)

  const mutation = actionType === "assign" ? AssignPermission : RemovePermission
  const [submitAction, { loading: mutationLoading }] = useMutation(mutation, {
    onCompleted: () => onSubmitSuccess(),
    onError: (err) => alert(err.message)
  })

  const handleCheckboxChange = (permissionId) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRoleId) return alert("Please select a target role")
    if (selectedPermissionIds.length === 0) return alert("Please select at least one permission")

    submitAction({
      variables: {
        input: {
          roleId: Number(selectedRoleId),
          permissionIds: selectedPermissionIds,
        },
      },
    })
  }

  if (rolesLoading || permissionsLoading) return <p>Loading form fields...</p>

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <h2>{actionType === "assign" ? "Grant Permissions" : "Revoke Permissions"}</h2>
      <p className="form-subtitle">Modify configuration rules assigned directly to system roles.</p>

      <div className="form-group">
        <label htmlFor="perm-role-select">Target System Role</label>
        <select
          id="perm-role-select"
          value={selectedRoleId}
          onChange={(e) => setSelectedRoleId(e.target.value)}
          required
        >
          <option value="">-- Choose a Role --</option>
          {rolesData?.getAllRoles?.map((role) => (
            <option key={role.id} value={role.id}>
              {role.role_name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Select System Permissions</label>
        <div className="permissions-checkbox-list" style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", borderRadius: "4px" }}>
          {permissionsData?.getAllPermission?.map((perm) => (
            <div key={perm.id} className="checkbox-item" style={{ display: "flex", gap: "8px", margin: "6px 0" }}>
              <input
                type="checkbox"
                id={`perm-${perm.id}`}
                checked={selectedPermissionIds.includes(Number(perm.id))}
                onChange={() => handleCheckboxChange(Number(perm.id))}
              />
              <label htmlFor={`perm-${perm.id}`}>{perm.permission_name}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={mutationLoading} className="btn-submit">
          {mutationLoading ? "Saving Changes..." : `${actionType === "assign" ? "Grant" : "Revoke"} Permissions`}
        </button>
      </div>
    </form>
  )
}

export default PermissionActionForm
