export const up = (pgm) => {
  pgm.sql(`
    CREATE TYPE employees_role_enum AS ENUM ('ADMIN', 'MANAGER', 'EMPLOYEE');

    CREATE TABLE employees (
        id SERIAL PRIMARY KEY,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255),
        role employees_role_enum NOT NULL DEFAULT 'EMPLOYEE',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  pgm.sql(`
    CREATE TABLE meeting_room (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        capacity INTEGER NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  pgm.sql(`
    CREATE TABLE equipments (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        "quantityAvailable" INTEGER NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  pgm.sql(`
    CREATE TABLE bookings (
        id SERIAL PRIMARY KEY,
        "startTime" TIMESTAMP NOT NULL,
        "endTime" TIMESTAMP NOT NULL,
        purpose VARCHAR(255) NOT NULL,
        "rejectionReason" TEXT,
        "numberOfAttendees" INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "employeeId" INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
        "meetingRoomId" INTEGER NOT NULL REFERENCES meeting_room(id) ON DELETE CASCADE
    );
  `);

  pgm.sql(`
    CREATE TABLE booking_equipments (
        "bookingId" INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
        "equipmentId" INTEGER NOT NULL REFERENCES equipments(id) ON DELETE CASCADE,
        PRIMARY KEY ("bookingId", "equipmentId")
    );
  `);

  pgm.sql(`
    CREATE TYPE audit_action_enum AS ENUM (
        'BOOKING_CREATED', 
        'BOOKING_APPROVED', 
        'BOOKING_REJECTED', 
        'BOOKING_CANCELLED'
    );

    CREATE TABLE audit_logs (
        id SERIAL PRIMARY KEY,
        "bookingId" INTEGER NOT NULL,
        action audit_action_enum NOT NULL,
        "oldStatus" VARCHAR(50),
        "newStatus" VARCHAR(50) NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "performedById" INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    );
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS audit_logs CASCADE;
    DROP TABLE IF EXISTS booking_equipments CASCADE;
    DROP TABLE IF EXISTS bookings CASCADE;
    DROP TABLE IF EXISTS equipments CASCADE;
    DROP TABLE IF EXISTS meeting_room CASCADE;
    DROP TABLE IF EXISTS employees CASCADE;
    
    DROP TYPE IF EXISTS audit_action_enum;
    DROP TYPE IF EXISTS employees_role_enum;
  `);
};
