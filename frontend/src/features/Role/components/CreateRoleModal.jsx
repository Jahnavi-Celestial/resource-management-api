import React from "react";
import { useMutation } from "@apollo/client/react";
import DynamicForm from "../../../shared/components/FormsField/DynamicForm";
import { CreateRole as CREATE_ROLE_MUTATION } from "../graphql/mutation";
import { GetAllRoles } from "../../../shared/services/queries";

const CreateRoleModal = ({ onSubmitSuccess }) => {
  const [createRole, { loading, error }] = useMutation(CREATE_ROLE_MUTATION, {
    refetchQueries: [{ query: GetAllRoles }],
  });

  const formConfig = [
    {
      name: "role_name",
      label: "Role Name",
      type: "text",
      placeholder: "Enter role name (e.g., Editor)",
      validators: [{ type: "required", message: "Role name is required" }],
    },
  ];

  const handleSubmit = async (formData, resetForm) => {
    try {
      await createRole({ variables: { input: { name: formData.role_name } } });
      resetForm();
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const backendErrors = error ? { role_name: error.message } : {};

  return (
    <div>
      <h3>Create New Role</h3>
      <DynamicForm
        config={formConfig}
        onSubmit={handleSubmit}
        isSubmitting={loading}
        backendErrors={backendErrors}
      />
    </div>
  );
};

export default CreateRoleModal;
