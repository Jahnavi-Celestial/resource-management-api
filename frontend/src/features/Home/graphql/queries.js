import { gql } from '@apollo/client';

export const Employees = gql`
query Employees($input: EmployeesFilterInput!) {
  employees(input: $input) {
    data {
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
    auditLogs {
      id
    }
    }
    total
    totalPages
    currentPage
  }
}
`

export const Bookings = gql`
query Bookings($input: BookingsFilterInput!) {
  bookings(input: $input) {
    data {
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
    total
    totalPages
    currentPage
  }
}
`

export const MostBookedRoom = gql`
query MostBookedRoom {
  mostBookedRoom {
    name
    total
  }
}
`

export const MonthlyBookingStatics = gql`
query MonthlyBookingStatics($input: MonthlyBookingStatisticsInput!) {
  monthlyBookingStatics(input: $input) {
    month
    totalBookings
    approvedBookings
    rejectedBookings
  }
}
`
