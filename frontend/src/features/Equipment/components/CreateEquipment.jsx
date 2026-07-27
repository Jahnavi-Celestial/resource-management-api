import React, { memo, useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CreateEquipment as CreateEquipmentMutation } from "../graphql/mutation";
import DynamicForm from "../../../shared/components/FormsField/DynamicForm";

const CreateEquipment = memo(({ onSubmitSuccess }) => {
  const [backendErrors, setBackendErrors] = useState({});
  const [createEquipmentAction, { loading: isSubmitting }] = useMutation(
    CreateEquipmentMutation,
  );

  const handleFormSubmit = async (formData, resetForm) => {
    setBackendErrors({});
    try {
      await createEquipmentAction({
        variables: {
          input: {
            name: formData.name,
            quantityAvailable: parseInt(formData.quantityAvailable, 10) || 0,
            isActive:
              formData.isActive === "true" || formData.isActive === true,
          },
        },
      });

      alert("Equipment created successfully!");
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

  const formSchema = useMemo(() => [
    {
      name: "name",
      type: "text",
      label: "Name",
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
      defaultValue: 1,
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
      defaultValue: "true",
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
  ], []);

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">Add New Equipment</h1>
          <p className="form-subtitle">
            Fill out the form below to add a new equipment.
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
});

export default CreateEquipment;
