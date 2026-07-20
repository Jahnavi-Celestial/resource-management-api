import { gql } from '@apollo/client'

export const Rooms = gql`
query Rooms($input: RoomsFilterInput!) {
  rooms(input: $input) {
    data {
      id
    name
    location
    capacity
    isActive
    created_at
    updated_at
    bookings {
      id
    startTime
    endTime
    purpose
    numberOfAttendees
    status
    createdAt
    updatedAt
    employeeId
    employee {
      id
      firstName
      lastName
    }
    meetingRoomId
    meetingRoom {
      id
      name
    }
    equipments {
      id
      name
    }
    }
    }
    total
    totalPages
    currentPage
  }
}
`

export const Equipments = gql`
query Equipments($input: EquipmentsFilterInput!) {
  equipments(input: $input) {
    data {
      id
    name
    quantityAvailable
    isActive
    created_at
    updated_at
    bookings {
      id
    startTime
    endTime
    purpose
    numberOfAttendees
    status
    createdAt
    updatedAt
    employeeId
    employee {
      id
      firstName
      lastName
    }
    meetingRoomId
    meetingRoom {
      id
      name
    }
    equipments {
      id
      name
    }
    }
    }
    total
    totalPages
    currentPage
  }
}
`

export const GetAllRoles = gql`
query GetAllRoles {
  getAllRoles {
    role_name
    id
  }
}
`

export const GetAllPermission = gql`
query GetAllPermission {
  getAllPermission {
    id
    permission_name
  }
}
`