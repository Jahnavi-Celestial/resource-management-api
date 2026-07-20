import { gql } from '@apollo/client';

export const CreateEquipment = gql`
mutation CreateEquipment($input: CreateEquipmentInput!) {
  createEquipment(input: $input) {
    id
    name
    quantityAvailable
    isActive
    created_at
    updated_at
  }
}
`

export const DeleteEquipment = gql`
mutation DeleteEquipment($deleteEquipmentId: Int!) {
  deleteEquipment(id: $deleteEquipmentId)
}
`

export const UpdateEquipment = gql`
mutation UpdateEquipment($input: UpdateEquipmentInput!) {
  updateEquipment(input: $input) {
    id
    name
    quantityAvailable
    isActive
    created_at
    updated_at
  }
}
`