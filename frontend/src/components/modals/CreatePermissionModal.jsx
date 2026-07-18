import React from 'react';
import { useMutation } from '@apollo/client/react';
import DynamicForm from '../FormsField/DynamicForm';
import { CreatePermission as CREATE_PERMISSION_MUTATION } from '../../graphql/mutations';
import { GetAllPermission } from '../../graphql/queries';

const CreatePermissionModal = ({ onSubmitSuccess }) => {
  const [createPermission, { loading, error }] = useMutation(CREATE_PERMISSION_MUTATION, {
    refetchQueries: [{ query: GetAllPermission }]
  });

  const formConfig = [
    {
      name: 'permission_name',
      label: 'Permission Name',
      type: 'text',
      placeholder: 'Enter permission name (e.g., read:items)',
      validators: [{ type: 'required', message: 'Permission name is required' }]
    }
  ]

  const handleSubmit = async (formData, resetForm) => {
    try {
      await createPermission({ variables: { input: { name: formData.permission_name } } });
      resetForm();
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const backendErrors = error ? { permission_name: error.message } : {}

  return (
    <div>
      <h3>Create New Permission</h3>
      <DynamicForm 
        config={formConfig} 
        onSubmit={handleSubmit} 
        isSubmitting={loading} 
        backendErrors={backendErrors}
      />
    </div>
  )
}

export default CreatePermissionModal
