import { gql } from '@apollo/client';

export const GetAllPermissionForRole = gql`
query GetAllPermissionForRole($roleId: Int!) {
  getAllPermissionForRole(roleId: $roleId) {
    id
    permission {
      id
      permission_name
    }
  }
}
`