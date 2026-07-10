import { gql } from '@apollo/client'

export const Rooms = gql`
query Rooms($input: RoomsFilterInput!) {
  rooms(input: $input) {
    rooms {
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
    equipments {
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

export const ViewOwnBookings = gql`
query ViewOwnBooking($input: BookingsFilterInput!) {
  viewOwnBooking(input: $input) {
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
    total
    totalPages
    currentPage
  }
}
`

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

export const Employees = gql`
query Employees($input: EmployeesFilterInput!) {
  employees(input: $input) {
    employees {
      id
    firstName
    lastName
    email
    role
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

export const Employee = gql`
query Employee($employeeId: Int!) {
  employee(id: $employeeId) {
    id
    firstName
    lastName
    email
    role
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

export const Bookings = gql`
query Bookings($input: BookingsFilterInput!) {
  bookings(input: $input) {
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
    total
    totalPages
    currentPage
  }
}
`

export const EquipmentUsage = gql`
query EquipmentUsage($input: EquipmentUsageInput!) {
  equipmentUsage(input: $input) {
    equipmentName
    timesUsage
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