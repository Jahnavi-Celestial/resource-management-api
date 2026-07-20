import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { UpdateEquipment as UpdateEquipmentMutation } from "../graphql/mutation";
import DynamicForm from "../../../shared/components/FormsField/DynamicForm";

const UpdateEquipment = ({ onSubmitSuccess, equipment }) => {
  const [backendErrors, setBackendErrors] = useState({});
  const [updateEquipmentAction, { loading: isSubmitting }] = useMutation(
    UpdateEquipmentMutation,
  );

  const handleFormSubmit = async (formData, resetForm) => {
    setBackendErrors({});
    try {
      await updateEquipmentAction({
        variables: {
          input: {
            id: equipment.id,
            name: formData.name,
            quantityAvailable: parseInt(formData.quantityAvailable, 10) || 0,
            isActive:
              formData.isActive === "true" || formData.isActive === true,
          },
        },
      });

      alert("Equipment updated successfully!");
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
      defaultValue: equipment?.name || "",
      validators: [
        {
          type: "required",
          message: "Equipment label name configuration matches are required",
        },
      ],
    },
    {
      name: "quantityAvailable",
      type: "number",
      label: "Quantity Available",
      defaultValue:
        equipment?.quantityAvailable !== undefined
          ? equipment.quantityAvailable
          : 0,
      validators: [
        {
          type: "required",
          message: "Stock allocation availability metrics required",
        },
      ],
    },
    {
      name: "isActive",
      type: "select",
      label: "Is Active",
      defaultValue:
        equipment?.isActive !== undefined
          ? equipment.isActive.toString()
          : "true",
      validators: [
        {
          type: "required",
          message: "System activity state flag status choice is mandatory",
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
          <h1 className="form-title">Update Equipment</h1>
          <p className="form-subtitle">
            Edit the form below to update an equipment.
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

export default UpdateEquipment;
