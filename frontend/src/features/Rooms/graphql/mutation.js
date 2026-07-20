import { gql } from '@apollo/client';

export const CreateRoom = gql`
mutation CreateRoom($input: CreateMeetingRoomInput!) {
  createRoom(input: $input) {
    id
    name
    location
    capacity
    isActive
    created_at
    updated_at
  }
}
`

export const UpdateRoom = gql`
mutation UpdateRoom($input: UpdateMeetingRoomInput!) {
  updateRoom(input: $input) {
    id
    name
    location
    capacity
    isActive
    created_at
    updated_at
  }
}
`

export const DeleteRoom = gql`
mutation DeleteRoom($deleteRoomId: Int!) {
  deleteRoom(id: $deleteRoomId)
}
`