import React, { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { UpdateRoom as UpdateRoomMutation } from "../../graphql/mutations"
import DynamicForm from "../FormsField/DynamicForm"

const UpdateRoom = ({ onSubmitSuccess, room }) => {
  const [backendErrors, setBackendErrors] = useState({})
  const [updateRoomAction, { loading: isSubmitting }] = useMutation(UpdateRoomMutation)

  const handleFormSubmit = async (formData, resetForm) => {
    setBackendErrors({})
    try {
      await updateRoomAction({
        variables: {
          input: {
            id: room.id,
            name: formData.name,
            location: formData.location,
            capacity: parseInt(formData.capacity, 10) || 1,
            isActive: formData.isActive === "true" || formData.isActive === true
          }
        }
      })

      alert("Room updated successfully!")
      resetForm()
      if (onSubmitSuccess) {
        onSubmitSuccess()
      }
    } catch (err) {
      if (err.graphQLErrors && err.graphQLErrors?.extensions?.validation) {
        setBackendErrors(err.graphQLErrors.extensions.validation)
      } else {
        setBackendErrors({ global: err.message })
      }
    }
  }

  const formSchema = [
    {
      name: "name",
      type: "text",
      label: "Name",
      defaultValue: room?.name || "",
      validators: [{ type: "required", message: "Room label configuration name matches are required" }]
    },
    {
      name: "location",
      type: "text",
      label: "Location",
      defaultValue: room?.location || "",
      validators: [{ type: "required", message: "Physical layout placement details are mandatory" }]
    },
    {
      name: "capacity",
      type: "number",
      label: "Capacity",
      defaultValue: room?.capacity !== undefined ? room.capacity : 1,
      validators: [{ type: "required", message: "Maximum structural allocation density count required" }]
    },
    {
      name: "isActive",
      type: "select",
      label: "Is Active",
      defaultValue: room?.isActive !== undefined ? room.isActive.toString() : "true",
      validators: [{ type: "required", message: "System activity resource selection condition is required" }],
      options: [
        { value: "true", label: "True" },
        { value: "false", label: "False" }
      ]
    }
  ]

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">Update Room</h1>
          <p className="form-subtitle">Edit the form below to update a room.</p>
        </div>

        {backendErrors.global && (
          <div className="global-error">
            {backendErrors.global}
          </div>
        )}

        <DynamicForm 
          config={formSchema} 
          onSubmit={handleFormSubmit} 
          backendErrors={backendErrors}
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  )
}

export default UpdateRoom
