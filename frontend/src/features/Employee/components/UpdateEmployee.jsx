import React, { memo, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { UpdateEmployee as UpdateEmployeeMutation } from "../graphql/mutation";
import DynamicForm from "../../../shared/components/FormsField/DynamicForm";
import { GetAllRoles } from "../../../shared/services/queries";

const UpdateEmployee = memo(({ onSubmitSuccess, employee }) => {
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
            firstName: formData.firstName || null,
            lastName: formData.lastName || null,
            email: formData.email || null,
            password: formData.password || null,
            roleIdFrom: Number(formData.roleIdFrom) || null,
            roleIdTo: Number(formData.roleIdTo) || null,
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

  const formSchema = useMemo(() => [
    {
      name: "firstName",
      type: "text",
      label: "First Name",
      defaultValue: employee?.firstName || "",
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
    },
    {
      name: "password",
      type: "password",
      label: "Password",
    },
    {
      name: "roleIdFrom",
      type: "select",
      label: "Role From",
      placeholder: "Select Role",
      options: roleOptions,
    },
    {
      name: "roleIdTo",
      type: "select",
      label: "Role To",
      placeholder: "Select Role",
      options: roleOptions,
    },
  ], [roleOptions]);

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
});

export default UpdateEmployee;
