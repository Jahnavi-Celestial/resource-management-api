import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CreateRoom as CreateRoomMutation } from "../graphql/mutation";
import DynamicForm from "../../../shared/components/FormsField/DynamicForm";

const CreateRoom = ({ onSubmitSuccess }) => {
  const [backendErrors, setBackendErrors] = useState({});
  const [createRoomAction, { loading: isSubmitting }] =
    useMutation(CreateRoomMutation);

  const handleFormSubmit = async (formData, resetForm) => {
    setBackendErrors({});
    try {
      await createRoomAction({
        variables: {
          input: {
            name: formData.name,
            location: formData.location,
            capacity: parseInt(formData.capacity, 10) || 1,
            isActive:
              formData.isActive === "true" || formData.isActive === true,
          },
        },
      });

      alert("Room created successfully!");
      resetForm();
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      if (err.graphQLErrors && err.graphQLErrors?.extensions?.validation) {
        setBackendErrors(err.graphQLErrors.extensions.validation);
      } else {
        setBackendErrors({ global: err.message });
      }
    }
  };

  const formSchema = [
    {
      name: "name",
      type: "text",
      label: "Name",
      validators: [
        {
          type: "required",
          message: "Room label configuration name matches are required",
        },
      ],
    },
    {
      name: "location",
      type: "text",
      label: "Location",
      validators: [
        {
          type: "required",
          message: "Physical layout placement details are mandatory",
        },
      ],
    },
    {
      name: "capacity",
      type: "number",
      label: "Capacity",
      defaultValue: 1,
      validators: [
        {
          type: "required",
          message: "Maximum structural allocation density count required",
        },
      ],
    },
    {
      name: "isActive",
      type: "select",
      label: "Is Active",
      defaultValue: "true",
      validators: [
        {
          type: "required",
          message: "System activity resource selection condition is required",
        },
      ],
      options: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
    },
  ];

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">Add New Room</h1>
          <p className="form-subtitle">
            Fill out the form below to add a new room.
          </p>
        </div>

        {backendErrors.global && (
          <div className="global-error">{backendErrors.global}</div>
        )}

        <DynamicForm
          config={formSchema}
          onSubmit={handleFormSubmit}
          backendErrors={backendErrors}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default CreateRoom;
