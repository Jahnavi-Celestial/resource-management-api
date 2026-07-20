import { gql } from '@apollo/client';

export const CreateRole = gql`
mutation CreateRole($input: CreateRoleInput!) {
  createRole(input: $input) {
    id
    role_name
  }
}
`

export const UpdateRole = gql`
mutation UpdateRole($input: UpdateRoleInput!) {
  updateRole(input: $input) {
    id
    role_name
  }
}
`

export const DeleteRole = gql`
mutation DeleteRole($deleteRoleId: Int!) {
  deleteRole(id: $deleteRoleId)
}
`

export const DeletePermission = gql`
mutation DeletePermission($deletePermissionId: Int!) {
  deletePermission(id: $deletePermissionId)
}
`

export const AssignRole = gql`
mutation AssignRole($input: AssignRemoveRoleInput!) {
  assignRole(input: $input) {
    email
    firstName
    lastName
    id
    updated_at
  }
}
`

export const RemoveRole = gql`
mutation RemoveRole($input: AssignRemoveRoleInput!) {
  removeRole(input: $input)
}
`