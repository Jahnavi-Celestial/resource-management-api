import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { GetAllRoles, Employee } from "../../graphql/queries" 
import { AssignRole, RemoveRole } from "../../graphql/mutations" 
import DynamicForm from "../FormsField/DynamicForm"

const RoleActionModal = ({ actionType, userId, onSubmitSuccess }) => {
  const [backendErrors, setBackendErrors] = useState({})
  const { data, loading, error } = useQuery(GetAllRoles)

  const mutation = actionType === "assign" ? AssignRole : RemoveRole
  const [submitAction, { loading: mutationLoading }] = useMutation(mutation, {
    refetchQueries: [{ query: Employee, variables: { employeeId: userId } }]
  })

  const handleFormSubmit = async (formData, resetForm) => {
    setBackendErrors({})
    try {
      await submitAction({
        variables: {
          input: {
            roleId: Number(formData.roleId),
            userId: userId
          }
        }
      })
      resetForm()
      if (onSubmitSuccess) {
        onSubmitSuccess()
      }
    } catch (err) {
      if (err.graphQLErrors && err.graphQLErrors?.extensions?.validation) {
        setBackendErrors(err.graphQLErrors.extensions.validation)
      } else {
        setBackendErrors({ global: err.message })
      }
    }
  }

  if (loading) {
    return (
      <div className="state-container">
        <p>Loading available roles...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-state">
        <h3>Error loading roles</h3>
        <p>Please refresh the page.</p>
      </div>
    )
  }

  const formSchema = [
    {
      name: "roleId",
      type: "select",
      label: "Select Target Role",
      placeholder: "-- Choose a Role --",
      validators: [{ type: "required", message: "Please select a role" }],
      options: (data?.getAllRoles || []).map(role => ({ value: role.id, label: role.role_name }))
    }
  ]

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">{actionType === "assign" ? "Assign Role" : "Remove Role"}</h1>
          <p className="form-subtitle">Apply role updates for this account reference.</p>
        </div>

        {backendErrors.global && (
          <div className="global-error">
            {backendErrors.global}
          </div>
        )}

        <DynamicForm 
          config={formSchema} 
          onSubmit={handleFormSubmit} 
          backendErrors={backendErrors}
          isSubmitting={mutationLoading} 
        />
      </div>
    </div>
  )
}

export default RoleActionModal
