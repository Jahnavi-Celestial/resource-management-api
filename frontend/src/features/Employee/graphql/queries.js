import { gql } from '@apollo/client'

export const Employee = gql`
query Employee($employeeId: Int!) {
  employee(id: $employeeId) {
    id
    firstName
    lastName
    email
    userRoles {
      id
      role {
        id
        role_name
      }
    }
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
}
`

export const BookingPerEmployee = gql`
query BookingsPerEmployee($input: BookingsPerEmployeeInput!) {
  bookingsPerEmployee(input: $input) {
    employeeName
    bookingCount
  }
}
`