import React from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import DynamicForm from "../../../shared/components/FormsField/DynamicForm";
import { DeleteRole, DeletePermission } from "../graphql/mutation";
import {
  GetAllPermission,
  GetAllRoles,
} from "../../../shared/services/queries";

const DeleteRoleOrPermissionModal = ({ type, onSubmitSuccess }) => {
  const isRole = type === "role";

  const { data: roleData, loading: roleLoading } = useQuery(GetAllRoles, {
    skip: !isRole,
  });
  const { data: permData, loading: permLoading } = useQuery(GetAllPermission, {
    skip: isRole,
  });

  const [deleteRole, { loading: delRoleLoading }] = useMutation(DeleteRole, {
    refetchQueries: [{ query: GetAllRoles }],
  });
  const [deletePermission, { loading: delPermLoading }] = useMutation(
    DeletePermission,
    { refetchQueries: [{ query: GetAllPermission }] },
  );

  const rawOptions = isRole
    ? roleData?.getAllRoles
    : permData?.getAllPermission;
  const options =
    rawOptions?.map((item) => ({
      value: item.id,
      label: isRole ? item.role_name : item.permission_name,
    })) || [];

  const formConfig = [
    {
      name: "id",
      label: `Select ${isRole ? "Role" : "Permission"} to Delete`,
      type: "select",
      placeholder: roleLoading || permLoading ? "Loading..." : "Select item",
      options: options,
      validators: [{ type: "required", message: "Selection is required" }],
    },
  ];

  const handleSubmit = async (formData, resetForm) => {
    const targetId = parseInt(formData.id, 10);
    if (!window.confirm(`Are you sure you want to delete this ${type}?`))
      return;

    try {
      if (isRole) {
        await deleteRole({ variables: { deleteRoleId: targetId } });
      } else {
        await deletePermission({ variables: { deletePermissionId: targetId } });
      }
      resetForm();
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Delete {isRole ? "Role" : "Permission"}</h3>
      <DynamicForm
        config={formConfig}
        onSubmit={handleSubmit}
        isSubmitting={delRoleLoading || delPermLoading}
      />
    </div>
  );
};

export default DeleteRoleOrPermissionModal;
