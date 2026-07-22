import { gql } from '@apollo/client';

export const CreateEmployee = gql`
mutation CreateEmployee($input: CreateEmployeeInput!) {
  createEmployee(input: $input) {
    id
    firstName
    lastName
    email
    created_at
    updated_at
  }
}
`

export const UpdateEmployee = gql`
mutation UpdateEmployee($input: UpdateEmployeeInput!) {
  updateEmployee(input: $input) {
    id
    firstName
    lastName
    email
    created_at
    updated_at
  }
}
`

export const DeleteEmployees = gql`
mutation DeleteEmployees($ids: [Int!]!) {
  deleteEmployees(ids: $ids)
}
`