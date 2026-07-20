import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { AssignPermission, RemovePermission } from "../graphql/mutation";
import DynamicForm from "../../../shared/components/FormsField/DynamicForm";
import {
  GetAllPermission,
  GetAllRoles,
} from "../../../shared/services/queries";

const PermissionActionModal = ({ actionType, onSubmitSuccess }) => {
  const [backendErrors, setBackendErrors] = useState({});

  const { data: rolesData, loading: rolesLoading } = useQuery(GetAllRoles);
  const { data: permissionsData, loading: permissionsLoading } =
    useQuery(GetAllPermission);

  const mutation =
    actionType === "assign" ? AssignPermission : RemovePermission;
  const [submitAction, { loading: mutationLoading }] = useMutation(mutation, {
    onCompleted: () => onSubmitSuccess(),
  });

  const handleFormSubmit = async (formData, resetForm) => {
    setBackendErrors({});
    try {
      await submitAction({
        variables: {
          input: {
            roleId: Number(formData.roleId),
            permissionIds: formData.permissionIds || [],
          },
        },
      });
      resetForm();
    } catch (err) {
      if (err.graphQLErrors && err.graphQLErrors?.extensions?.validation) {
        setBackendErrors(err.graphQLErrors.extensions.validation);
      } else {
        setBackendErrors({ global: err.message });
      }
    }
  };

  if (rolesLoading || permissionsLoading) {
    return (
      <div className="state-container">
        <p>Loading form fields...</p>
      </div>
    );
  }

  const formSchema = [
    {
      name: "roleId",
      type: "select",
      label: "Target System Role",
      placeholder: "-- Choose a Role --",
      validators: [
        { type: "required", message: "Please select a target role" },
      ],
      options: (rolesData?.getAllRoles || []).map((role) => ({
        value: role.id,
        label: role.role_name,
      })),
    },
    {
      name: "permissionIds",
      label: "Select System Permissions",
      defaultValue: [],
      validators: [
        { type: "required", message: "Please select at least one permission" },
      ],
      renderCustom: ({
        name,
        value: selectedList,
        onChange,
        externalError,
      }) => {
        const handleCheckboxChange = (id) => {
          const updatedList = selectedList.includes(id)
            ? selectedList.filter((item) => item !== id)
            : [...selectedList, id];
          onChange(name, updatedList);
        };

        return (
          <div key={name} className="form-group">
            <label className="form-label">Select System Permissions</label>
            <div
              className="list-container"
              style={{ maxHeight: "200px", overflowY: "auto", padding: "10px" }}
            >
              {(permissionsData?.getAllPermission || []).map((perm) => {
                const permId = Number(perm.id);
                return (
                  <div
                    key={permId}
                    className="flex-center"
                    style={{ margin: "6px 0" }}
                  >
                    <input
                      type="checkbox"
                      id={`perm-${permId}`}
                      checked={selectedList.includes(permId)}
                      onChange={() => handleCheckboxChange(permId)}
                    />
                    <label
                      htmlFor={`perm-${permId}`}
                      style={{ cursor: "pointer" }}
                    >
                      {perm.permission_name}
                    </label>
                  </div>
                );
              })}
            </div>
            {externalError && (
              <span className="error-feedback">{externalError}</span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">
            {actionType === "assign"
              ? "Grant Permissions"
              : "Revoke Permissions"}
          </h1>
          <p className="form-subtitle">
            Modify configuration rules assigned directly to system roles.
          </p>
        </div>

        {backendErrors.global && (
          <div className="global-error">{backendErrors.global}</div>
        )}

        <DynamicForm
          config={formSchema}
          onSubmit={handleFormSubmit}
          backendErrors={backendErrors}
          isSubmitting={mutationLoading}
        />
      </div>
    </div>
  );
};

export default PermissionActionModal;
