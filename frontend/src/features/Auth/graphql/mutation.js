import { gql } from '@apollo/client';

export const Register = gql`
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    id
    firstName
    lastName
    email
    created_at
    updated_at
  }
}
`

export const Login = gql`
mutation Login($input: LoginInput!) {
  login(input: $input)
}
`