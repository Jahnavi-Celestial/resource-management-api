import React from "react";
import { useMutation } from "@apollo/client/react";
import { DeleteEquipment as DeleteEquipmentMutation } from "../../graphql/mutations";
import "./DeleteEquipment.css";

const DeleteEquipment = ({ onSubmitSuccess, id, refetch }) => {
  const [deleteEquipmentAction] = useMutation(DeleteEquipmentMutation)

  const handleDeleteBtn = async () => {
    try {
      await deleteEquipmentAction({
        variables: { deleteEquipmentId: id }
      });

      if (onSubmitSuccess) {
        onSubmitSuccess()
      }

      if (refetch) {
        refetch()
      }
    } catch (err) {
      alert(err.message)
    }
  };

  return (
    <div className="delete-modal-inner">
      <div className="warning-icon-wrapper">
        <svg className="warning-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <h2 className="delete-title">Delete Equipment</h2>
      <p className="delete-description">
        Are you sure you want to remove this item from inventory? This action is permanent and will unassign it from any scheduled bookings.
      </p>

      <div className="delete-actions-row">
        <button className="btn-cancel" onClick={onSubmitSuccess}>
          Keep Inventory Item
        </button>
        <button className="btn-confirm-delete" onClick={handleDeleteBtn}>
          Confirm Delete
        </button>
      </div>
    </div>
  )
}

export default DeleteEquipment
