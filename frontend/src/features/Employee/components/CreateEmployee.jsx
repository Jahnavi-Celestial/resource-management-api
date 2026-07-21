import React, { memo, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { CreateEmployee as CreateEmployeeMutation } from "../graphql/mutation";
import DynamicForm from "../../../shared/components/FormsField/DynamicForm";
import { GetAllRoles } from "../../../shared/services/queries";

const CreateEmployee = memo(({ onSubmitSuccess }) => {
  const [backendErrors, setBackendErrors] = useState({});
  const { data, loading, error } = useQuery(GetAllRoles);

  const [createEmployeeAction, { loading: isSubmitting }] = useMutation(
    CreateEmployeeMutation,
  );

  const handleFormSubmit = async (formData, resetForm) => {
    setBackendErrors({});
    try {
      await createEmployeeAction({
        variables: {
          input: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            roleId: Number(formData.roleId),
          },
        },
      });

      alert("Employee created successfully!");
      resetForm();
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      if (err.graphQLErrors && err.graphQLErrors[0]?.extensions?.validation) {
        setBackendErrors(err.graphQLErrors[0].extensions.validation);
      } else {
        setBackendErrors({ global: err.message });
      }
    }
  };

  if (error) {
    return (
      <div className="error-state">
        <h3>Failed to load configurations</h3>
        <p>Please refresh the page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="state-container">
        <p>Gathering system resources...</p>
      </div>
    );
  }

  const formSchema = [
    {
      name: "firstName",
      type: "text",
      label: "First Name",
      validators: [{ type: "required", message: "First name is required" }],
    },
    {
      name: "lastName",
      type: "text",
      label: "Last Name",
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      validators: [{ type: "required", message: "Email is required" }],
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      validators: [{ type: "required", message: "Password is required" }],
    },
    {
      name: "roleId",
      type: "select",
      label: "Role",
      placeholder: "Select Role",
      validators: [
        { type: "required", message: "Selecting a role is mandatory" },
      ],
      options: (data?.getAllRoles || []).map((role) => ({
        value: role.id,
        label: role.role_name,
      })),
    },
  ];

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">Add New Employee</h1>
          <p className="form-subtitle">
            Fill out the form below to add a new employee.
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

export default CreateEmployee;
