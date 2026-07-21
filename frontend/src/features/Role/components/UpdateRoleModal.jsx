import React, { memo, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import DynamicForm from "../../../shared/components/FormsField/DynamicForm";
import { UpdateRole } from "../graphql/mutation";
import { GetAllRoles } from "../../../shared/services/queries";

const UpdateRoleModal = memo(({ onSubmitSuccess }) => {
  const { data, loading: queryLoading } = useQuery(GetAllRoles);
  const [updateRole, { loading: mutationLoading, error }] = useMutation(
    UpdateRole,
    {
      refetchQueries: [{ query: GetAllRoles }],
    },
  );

  const roleOptions =
    data?.getAllRoles?.map((role) => ({
      value: role.id,
      label: role.role_name,
    })) || [];

  const formConfig = useMemo(() => [
    {
      name: "id",
      label: "Select Role to Update",
      type: "select",
      placeholder: queryLoading ? "Loading roles..." : "Choose a role",
      options: roleOptions,
      validators: [{ type: "required", message: "Please select a role" }],
    },
    {
      name: "role_name",
      label: "New Role Name",
      type: "text",
      placeholder: "Enter updated name",
      validators: [{ type: "required", message: "Updated name is required" }],
    },
  ], [roleOptions]);

  const handleSubmit = async (formData, resetForm) => {
    try {
      await updateRole({
        variables: {
          input: {
            id: Number(formData.id),
            name: formData.role_name,
          },
        },
      });
      resetForm();
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const backendErrors = error ? { role_name: error.message } : {};

  return (
    <div>
      <h3>Update Existing Role</h3>
      <DynamicForm
        config={formConfig}
        onSubmit={handleSubmit}
        isSubmitting={mutationLoading}
        backendErrors={backendErrors}
      />
    </div>
  );
});

export default UpdateRoleModal;
