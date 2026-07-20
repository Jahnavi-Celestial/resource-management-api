import { gql } from '@apollo/client'

export const Booking = gql`
query Booking($bookingId: Int!) {
  booking(id: $bookingId) {
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
`

export const ViewOwnBookings = gql`
query ViewOwnBooking($input: BookingsFilterInput!) {
  viewOwnBooking(input: $input) {
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