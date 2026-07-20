import { gql } from '@apollo/client';

export const EquipmentUsage = gql`
query EquipmentUsage($input: EquipmentUsageInput!) {
  equipmentUsage(input: $input) {
    equipmentName
    timesUsage
  }
}
`

export const Equipment = gql`
query Equipment($equipmentId: Int!) {
  equipment(id: $equipmentId) {
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
}
`