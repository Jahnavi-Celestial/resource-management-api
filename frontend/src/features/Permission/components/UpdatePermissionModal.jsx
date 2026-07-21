import React, { memo, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import DynamicForm from "../../../shared/components/FormsField/DynamicForm";
import { UpdatePermission } from "../graphql/mutation";
import { GetAllPermission } from "../../../shared/services/queries";

const UpdatePermissionModal = memo(({ onSubmitSuccess }) => {
  const { data, loading: queryLoading } = useQuery(GetAllPermission);
  const [updatePermission, { loading: mutationLoading, error }] = useMutation(
    UpdatePermission,
    {
      refetchQueries: [{ query: GetAllPermission }],
    },
  );

  const permissionOptions =
    data?.getAllPermission?.map((p) => ({
      value: p.id,
      label: p.permission_name,
    })) || [];

  const formConfig = useMemo(() => [
    {
      name: "id",
      label: "Select Permission to Update",
      type: "select",
      placeholder: queryLoading
        ? "Loading permissions..."
        : "Choose a permission",
      options: permissionOptions,
      validators: [{ type: "required", message: "Please select a permission" }],
    },
    {
      name: "permission_name",
      label: "New Permission Name",
      type: "text",
      placeholder: "Enter updated name",
      validators: [{ type: "required", message: "Updated name is required" }],
    },
  ], [permissionOptions, data]);

  const handleSubmit = async (formData, resetForm) => {
    try {
      await updatePermission({
        variables: {
          input: {
            id: Number(formData.id),
            name: formData.permission_name,
          },
        },
      });
      resetForm();
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const backendErrors = error ? { permission_name: error.message } : {};

  return (
    <div>
      <h3>Update Existing Permission</h3>
      <DynamicForm
        config={formConfig}
        onSubmit={handleSubmit}
        isSubmitting={mutationLoading}
        backendErrors={backendErrors}
      />
    </div>
  );
});

export default UpdatePermissionModal;
