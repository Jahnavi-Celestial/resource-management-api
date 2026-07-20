import { gql } from '@apollo/client';

export const CreatePermission = gql`
mutation CreatePermission($input: CreatePermissionInput!) {
  createPermission(input: $input) {
    id
    permission_name
  }
}
`

export const UpdatePermission = gql`
mutation UpdatePermission($input: UpdatePermissionInput!) {
  updatePermission(input: $input) {
    id
    permission_name
  }
}
`

export const AssignPermission = gql`
mutation AssignPermission($input: AssignPermissionInput!) {
  assignPermission(input: $input)
}
`

export const RemovePermission = gql`
mutation RemovePermission($input: RemovePermissionInput!) {
  removePermission(input: $input)
}
`