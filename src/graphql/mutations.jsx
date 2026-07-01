import { gql } from '@apollo/client';

export const Register = gql`
mutation Register($role: String!, $password: String!, $email: String!, $lastName: String!, $firstName: String!) {
  register(role: $role, password: $password, email: $email, lastName: $lastName, firstName: $firstName) {
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
mutation Login($password: String!, $email: String!) {
  login(password: $password, email: $email)
}
`

export const CreateBooking = gql`
mutation CreateBooking($meetingRoomId: Int!, $numberOfAttendees: Int!, $purpose: String!, $endTime: DateTimeISO!, $startTime: DateTimeISO!, $equipmentRequested: [EquipRequestInput!]) {
  createBooking(meetingRoomId: $meetingRoomId, numberOfAttendees: $numberOfAttendees, purpose: $purpose, endTime: $endTime, startTime: $startTime, equipmentRequested: $equipmentRequested) {
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
mutation CreateEmployee($role: Role!, $password: String!, $email: String!, $lastName: String!, $firstName: String!) {
  createEmployee(role: $role, password: $password, email: $email, lastName: $lastName, firstName: $firstName) {
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
mutation CreateEquipment($isActive: Boolean!, $quantityAvailable: Int!, $name: String!) {
  createEquipment(isActive: $isActive, quantityAvailable: $quantityAvailable, name: $name) {
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
mutation CreateRoom($isActive: Boolean!, $capacity: Int!, $location: String!, $name: String!) {
  createRoom(isActive: $isActive, capacity: $capacity, location: $location, name: $name) {
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
mutation ApproveBooking($bookingId: Int!) {
  approveBooking(bookingId: $bookingId) {
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
mutation RejectBooking($bookingId: Int!, $rejectionReason: String!) {
  rejectBooking(bookingId: $bookingId, rejectionReason: $rejectionReason) {
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
mutation UpdateRoom($isActive: Boolean!, $capacity: Int!, $location: String!, $name: String!, $updateRoomId: Int!) {
  updateRoom(isActive: $isActive, capacity: $capacity, location: $location, name: $name, id: $updateRoomId) {
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
mutation UpdateEquipment($isActive: Boolean!, $quantityAvailable: Int!, $name: String!, $updateEquipmentId: Int!) {
  updateEquipment(isActive: $isActive, quantityAvailable: $quantityAvailable, name: $name, id: $updateEquipmentId) {
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
mutation UpdateEmployee($role: Role!, $email: String!, $lastName: String!, $firstName: String!, $updateEmployeeId: Int!, $password: String!) {
  updateEmployee(role: $role, email: $email, lastName: $lastName, firstName: $firstName, id: $updateEmployeeId, password: $password) {
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