import { gql } from '@apollo/client'

export const Room = gql`
query Room($roomId: Int!) {
  room(id: $roomId) {
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
}
`