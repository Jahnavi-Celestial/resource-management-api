import { gql } from '@apollo/client';

export const Register = gql`
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    id
    firstName
    lastName
    email
    role 
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

export const CreateBooking = gql`
mutation CreateBooking($input: CreateBookingInput!) {
  createBooking(input: $input) {
    id
    startTime
    endTime
    purpose
    numberOfAttendees
    status
    createdAt
    updatedAt
    employeeId
    meetingRoomId
    equipments {
      id
    }
  }
}
`

export const CreateEmployee = gql`
mutation CreateEmployee($input: CreateEmployeeInput!) {
  createEmployee(input: $input) {
    id
    firstName
    lastName
    email
    role 
    created_at
    updated_at
  }
}
`

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

export const CancelBooking = gql`
mutation CancelBooking($bookingId: Int!) {
  cancelBooking(bookingId: $bookingId) {
    id
    startTime
    endTime
    purpose
    numberOfAttendees
    status
    createdAt
    updatedAt
    employeeId
    meetingRoomId
    equipments {
      id
    }
  }
}
`

export const ApproveBooking = gql`
mutation ApproveBooking($input: ApproveBookingInput!) {
  approveBooking(input: $input) {
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
      firstName
    }
    meetingRoomId
    equipments {
      id
    }
  }
}
`

export const RejectBooking = gql`
mutation RejectBooking($input: RejectBookingInput!) {
  rejectBooking(input: $input) {
    id
    startTime
    endTime
    purpose
    rejectionReason
    numberOfAttendees
    status
    createdAt
    updatedAt
    employeeId
    meetingRoomId
    employee {
      firstName
    }
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

export const UpdateEmployee = gql`
mutation UpdateEmployee($input: UpdateEmployeeInput!) {
  updateEmployee(input: $input) {
    id
    firstName
    lastName
    email
    role 
    created_at
    updated_at
  }
}
`

export const DeleteEmployee = gql`
mutation DeleteEmployee($deleteEmployeeId: Int!) {
  deleteEmployee(id: $deleteEmployeeId)
}
`