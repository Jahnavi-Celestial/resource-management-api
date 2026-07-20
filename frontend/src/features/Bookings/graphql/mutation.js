import { gql } from '@apollo/client'

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