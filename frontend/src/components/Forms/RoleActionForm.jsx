import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GetAllRoles, Employee } from "../../graphql/queries"; 
import { AssignRole, RemoveRole } from "../../graphql/mutations"; 
import "./RoleActionForm.css"

const RoleActionForm = ({ actionType, userId, onSubmitSuccess }) => {
  const [selectedRoleId, setSelectedRoleId] = useState("")
  const { data, loading, error } = useQuery(GetAllRoles)

  const mutation = actionType === "assign" ? AssignRole : RemoveRole
  const [submitAction, { loading: mutationLoading }] = useMutation(mutation, {
    refetchQueries: [{ query: Employee, variables: { employeeId: userId } }],
    onCompleted: () => onSubmitSuccess(),
    onError: (err) => alert(err.message)
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRoleId) return alert("Please select a role");

    submitAction({
      variables: {
        input: {
          roleId: Number(selectedRoleId),
          userId: userId,
        },
      }
    })
  }

  if (loading) return <p>Loading available roles...</p>
  if (error) return <p>Error loading roles</p>

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <h2>{actionType === "assign" ? "Assign Role" : "Remove Role"}</h2>
      <p className="form-subtitle">Apply role updates for this account reference.</p>
      
      <div className="form-group">
        <label htmlFor="role-select">Select Target Role</label>
        <select
          id="role-select"
          value={selectedRoleId}
          onChange={(e) => setSelectedRoleId(e.target.value)}
          required
        >
          <option value="">-- Choose a Role --</option>
          {data?.getAllRoles?.map((role) => (
            <option key={role.id} value={role.id}>
              {role.role_name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={mutationLoading} className="btn-submit">
          {mutationLoading ? "Processing..." : `${actionType === "assign" ? "Assign" : "Remove"} Role`}
        </button>
      </div>
    </form>
  );
};

export default RoleActionForm;
