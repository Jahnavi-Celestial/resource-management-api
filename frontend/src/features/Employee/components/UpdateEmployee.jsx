import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { UpdateEmployee as UpdateEmployeeMutation } from "../graphql/mutation";
import DynamicForm from "../../../shared/components/FormsField/DynamicForm";
import { GetAllRoles } from "../../../shared/services/queries";

const UpdateEmployee = ({ onSubmitSuccess, employee }) => {
  const [backendErrors, setBackendErrors] = useState({});
  const { data, loading, error } = useQuery(GetAllRoles);

  const [updateEmployeeAction, { loading: isSubmitting }] = useMutation(
    UpdateEmployeeMutation,
  );

  const handleFormSubmit = async (formData, resetForm) => {
    setBackendErrors({});
    try {
      await updateEmployeeAction({
        variables: {
          input: {
            id: employee.id,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            roleIdFrom: Number(formData.roleIdFrom),
            roleIdTo: Number(formData.roleIdTo),
          },
        },
      });

      alert("Employee updated successfully!");
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

  const roleOptions = (data?.getAllRoles || []).map((role) => ({
    value: role.id,
    label: role.role_name,
  }));

  const formSchema = [
    {
      name: "firstName",
      type: "text",
      label: "First Name",
      defaultValue: employee?.firstName || "",
      validators: [{ type: "required", message: "First name is required" }],
    },
    {
      name: "lastName",
      type: "text",
      defaultValue: employee?.lastName || "",
      label: "Last Name",
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      defaultValue: employee?.email || "",
      validators: [{ type: "required", message: "Email is required" }],
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      validators: [
        {
          type: "required",
          message: "Password validation verification is required",
        },
      ],
    },
    {
      name: "roleIdFrom",
      type: "select",
      label: "Role From",
      placeholder: "Select Role",
      validators: [
        {
          type: "required",
          message: "Selecting original role constraint is mandatory",
        },
      ],
      options: roleOptions,
    },
    {
      name: "roleIdTo",
      type: "select",
      label: "Role To",
      placeholder: "Select Role",
      validators: [
        {
          type: "required",
          message: "Selecting destination target role is mandatory",
        },
      ],
      options: roleOptions,
    },
  ];

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">Update Employee</h1>
          <p className="form-subtitle">
            Edit the form below to update an employee.
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

export default UpdateEmployee;
