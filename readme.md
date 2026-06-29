# Resource Booking Management System API

A robust, backend-only GraphQL API built with Node.js, TypeScript, TypeGraphQL, and TypeORM to manage office resources, employee reservations, and operational audit logs with transactional state integrity.

## Getting Started

Follow these steps to configure your environment and run the application locally.

### 1. Project Setup

Clone the repository and install all Node.js dependencies.

```bash
# Clone the repository
git clone [https://github.com](https://github.com/Jahnavi-Celestial/resource-management-api)

# Navigate to the project directory
cd resource-booking-api

# Install dependencies
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory of your project. Copy the template below and replace the values with your local settings.

```env
# Server Configuration
PORT=4000

# Database Configuration
DB_URL = your database url

# Security
JWT_SECRET = your_super_secret_jwt_signing_key
```

### 3. Database Setup

Ensure your PostgreSQL server is running locally, then initialize your project database.

### 4. Running Migrations

Execute your postgres migrations to set up tables, database constraints, and relationships.

```bash
# Run schema migrations
npm run migrate up
```

### 5. Starting the Application

Launch the development server with automated code reloading.

```bash
# Start development server
npm run dev
```

Once running, access the interactive GraphQL testing environment at:
* **GraphQL Playground / Apollo Sandbox:** `http://localhost:4000/graphql`

---

## Authentication & Role-Based Authorization

This API uses stateless **JWT (JSON Web Tokens)** to enforce security boundaries via TypeGraphQL `@Authorized` decorators.

* **To Authenticate Requests:** Include your token inside the GraphQL Playground/Apollo Sandbox request headers configuration:
  ```json
  {
    "Authorization": "Bearer YOUR_JWT_TOKEN"
  }
  ```
* **RBAC Controls:** 
  * `ADMIN` / `MANAGER`: Full access to resource mutations, approvals, system audits, and employee records.
  * `EMPLOYEE`: Access to view catalogs and manage/view their own bookings.

---

## Optimized Database-Level Searching & Transactions

To fulfill performance and security design criteria:
* **No In-Memory Processing:** Search evaluations utilize native SQL `ILike` and structured filter matches directly at the PostgreSQL layer.
* **ACID Transactions:** Core operations (like Booking creation) leverage secure database transactions (`AppDataSource.transaction`). This guarantees atomic updates—ensuring room overlap tracking, equipment inventory decrements, and `AuditLog` row generation either all succeed together or cleanly rollback on errors.

---

## GraphQL Mutations

### Authentication Mutations

#### Register an Employee
* **Validations:** Fields cannot be empty; email formatting rules apply; password must be ≥ 6 characters.
```graphql
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
```

#### Login (Returns JWT String)
```graphql
mutation Login($password: String!, $email: String!) {
  login(password: $password, email: $email)
}
```

### Meeting Room Mutations

#### Create Room
* **Access Control:** `@Authorized("ADMIN")`
* **Validations:** Structural inputs cannot be empty.
```graphql
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
```
* **Variables Example:**
```json
{
  "name": "Boardroom A",
  "location": "3rd Floor - Wing B",
  "capacity": 12,
  "isActive": true
}
```

### Booking Lifecycle Mutations

#### Create Booking (Atomic Transaction)
* **Access Control:** `@Authorized("EMPLOYEE")`
* **Validations Enforced:** 
  * Room existence check and active status enforcement.
  * Structural capability checking (`room.capacity >= numberOfAttendees`).
  * Automated database lookups for overlapping times against current active or approved dates.
  * Equipment inventory verification and quantity safe checks.
  * Enforces an automated sequence creating structural histories in the `AuditLog` table.
```graphql
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
```
* **Variables Example:**
```json
{
  "startTime": "2026-07-15T10:00:00.000Z",
  "endTime": "2026-07-15T11:30:00.000Z",
  "purpose": "Sprint Planning Meeting",
  "numberOfAttendees": 8,
  "meetingRoomId": 1,
  "equipmentRequested": [
    {
      "equipId": 3,
      "quantity": 2
    }
  ]
}
```

---

## GraphQL Queries

### Booking Queries

#### Get All Bookings (Paginated & Status-Filtered)
* **Access Control:** `@Authorized(["ADMIN", "MANAGER"])`
```graphql
query Bookings($bookingStatus: BookingStatus, $limit: Int!, $page: Int!) {
  bookings(bookingStatus: $bookingStatus, limit: $limit, page: $page) {
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
        firstName
      }
      meetingRoomId
      equipments {
        id
      }
    }
    total
    totalPages
    currentPage
  }
}
```

#### View Own Bookings (Paginated)
* **Access Control:** `@Authorized("EMPLOYEE")`
```graphql
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
```

### Employee Queries (`ADMIN` / `MANAGER`)

#### Get All Employees (Paginated with Name Search)
```graphql
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
```
