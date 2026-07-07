import { gql } from '@apollo/client'

export const Rooms = gql`
query Rooms($page: Int!, $limit: Int!, $searchTerm: String) {
  rooms(page: $page, limit: $limit, searchTerm: $searchTerm) {
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
query Equipments($page: Int!, $limit: Int!, $searchTerm: String) {
  equipments(page: $page, limit: $limit, searchTerm: $searchTerm) {
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
query ViewOwnBooking($page: Int!, $limit: Int!, $bookingStatus: BookingStatus) {
  viewOwnBooking(page: $page, limit: $limit, bookingStatus: $bookingStatus) {
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
query Employees($page: Int!, $limit: Int!, $searchTerm: String) {
  employees(page: $page, limit: $limit, searchTerm: $searchTerm) {
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
query Bookings($page: Int!, $limit: Int!, $bookingStatus: BookingStatus) {
  bookings(page: $page, limit: $limit, bookingStatus: $bookingStatus) {
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
query EquipmentUsage($equipId: Int!) {
  equipmentUsage(equipId: $equipId) {
    equipmentName
    timesUsage
  }
}
`

export const BookingPerEmployee = gql`
query BookingsPerEmployee($empId: Int!) {
  bookingsPerEmployee(empId: $empId) {
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
query MonthlyBookingStatics($year: Int!, $month: Int!) {
  monthlyBookingStatics(year: $year, month: $month) {
    month
    totalBookings
    approvedBookings
    rejectedBookings
  }
}

`