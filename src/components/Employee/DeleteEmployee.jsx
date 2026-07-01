import React from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { DeleteEmployee as DeleteEmployeeMutation } from "../../graphql/mutations";
import "./DeleteEmployee.css";

const DeleteEmployee = ({ onSubmitSuccess, id }) => {
  const navigate = useNavigate()
  const [deleteEmployeeAction] = useMutation(DeleteEmployeeMutation)

  const handleDeleteBtn = async () => {
    try {
      await deleteEmployeeAction({
        variables: { deleteEmployeeId: id },
      })

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }

      navigate("/home")
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="delete-modal-inner">
      <div className="warning-icon-wrapper">
        <svg className="warning-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <h2 className="delete-title">Delete Employee Account</h2>
      <p className="delete-description">
        Are you sure you want to delete this profile? This action is permanent and all associated record assignments will be removed.
      </p>

      <div className="delete-actions-row">
        <button className="btn-cancel" onClick={onSubmitSuccess}>
          Keep Account
        </button>
        <button className="btn-confirm-delete" onClick={handleDeleteBtn}>
          Confirm Delete
        </button>
      </div>
    </div>
  )
}

export default DeleteEmployee
