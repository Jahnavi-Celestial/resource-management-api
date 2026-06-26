import bcrypt from 'bcrypt';

export const up = async (pgm)=>{
    const hashedPassword = await bcrypt.hash('123456', 10);

    pgm.sql(`
        INSERT INTO employees(id, "firstName", "lastName", email, password, role)
        VALUES
        (1, 'Pallavi', 'Pathak', 'pallavi@gmail.com', '${hashedPassword}', 'EMPLOYEE'),
        (2, 'Rahul', 'Sharma', 'rahul@gmail.com', '${hashedPassword}', 'ADMIN'),
        (3, 'Raj', 'Singh', 'raj@gmail.com', '${hashedPassword}', 'EMPLOYEE'),
        (4, 'Priya', 'Mittal', 'priya@gmail.com', '${hashedPassword}', 'EMPLOYEE'),
        (5, 'Manshi', 'Rajput', 'manshi@gmail.com', '${hashedPassword}', 'ADMIN'),
        (6, 'Rishi', 'Upadhaya', 'rishi@gmail.com', '${hashedPassword}', 'MANAGER'),
        (7, 'Yug', 'Mehta', 'yug@gmail.com', '${hashedPassword}', 'MANAGER'),
        (8, 'Gauri', 'Mehta', 'gauri@gmail.com', '${hashedPassword}', 'ADMIN'),
        (9, 'Kajal', 'Soni', 'kajal@gmail.com', '${hashedPassword}', 'EMPLOYEE'),
        (10, 'Kartik', 'Singh', 'kartik@gmail.com', '${hashedPassword}', 'EMPLOYEE'),
        (11, 'Krishna', 'Mittal', 'krishna@gmail.com', '${hashedPassword}', 'ADMIN'),
        (12, 'Piyush', 'Agrawal', 'piyush@gmail.com', '${hashedPassword}', 'EMPLOYEE'),
        (13, 'Gayu', 'Shrivastav', 'gayu@gmail.com', '${hashedPassword}', 'MANAGER'),
        (14, 'Kinjal', 'Chaudhary', 'kinjal@gmail.com', '${hashedPassword}', 'EMPLOYEE'),
        (15, 'Rohan', 'Chaudhary', 'rohan@gmail.com', '${hashedPassword}', 'MANAGER')
        ON CONFLICT DO NOTHING;

        SELECT setval(pg_get_serial_sequence('employees', 'id'), COALESCE((SELECT MAX(id) FROM employees), 1));
    `)

    pgm.sql(`
        INSERT INTO meeting_room(id, name, location, capacity, "isActive")
        VALUES
        (1, 'Room 1', 'First Floor', 50, true),
        (2, 'Room 2', 'First Floor', 40, true),
        (3, 'Room 3', 'First Floor', 45, true),
        (4, 'Room 4', 'Second Floor', 30, false),
        (5, 'Room 5', 'Second Floor', 45, true),
        (6, 'Room 6', 'Second Floor', 50, true),
        (7, 'Room 7', 'Third Floor', 40, false),
        (8, 'Room 8', 'Third Floor', 55, true),
        (9, 'Room 9', 'Third Floor', 35, true),
        (10, 'Room 10', 'Third Floor', 40, false)
        ON CONFLICT DO NOTHING;

        SELECT setval(pg_get_serial_sequence('meeting_room', 'id'), COALESCE((SELECT MAX(id) FROM meeting_room), 1));
    `)

    pgm.sql(`
        INSERT INTO bookings(id, "startTime", "endTime", purpose, "rejectionReason", "numberOfAttendees", status, "employeeId", "meetingRoomId")
        VALUES 
        (1, '2026-07-01T09:00:00Z', '2026-07-01 10:30:00', 'Sprint Planning', NULL, 15, 'APPROVED', 4, 1),
        (2, '2026-07-01T11:00:00Z', '2026-07-01 12:00:00', 'Client Demo', NULL, 8, 'APPROVED', 1, 2),
        (3, '2026-07-01T14:00:00Z', '2026-07-01 15:30:00', 'Tech Architecture Sync', NULL, 5, 'PENDING', 12, 3),
        (4, '2026-07-02T10:00:00Z', '2026-07-02 11:00:00', 'Quarterly Review', NULL, 45, 'APPROVED', 9, 8),
        (5, '2026-07-02T13:00:00Z', '2026-07-02 14:00:00', 'HR Induction', NULL, 20, 'APPROVED', 14, 5),
        (6, '2026-07-02T15:00:00Z', '2026-07-02 16:00:00', '1-on-1 Performance Talk', NULL, 2, 'APPROVED', 12, 6),
        (7, '2026-07-03T09:30:00Z', '2026-07-03 10:30:00', 'Marketing Brainstorm', NULL, 12, 'PENDING', 3, 9),
        (8, '2026-07-03T11:00:00Z', '2026-07-03 13:00:00', 'Product Roadmap', NULL, 25, 'APPROVED', 4, 1),
        (9, '2026-07-03T14:30:00Z', '2026-07-03 15:30:00', 'Code Review', 'Approving for another task', 4, 'REJECTED', 4, 2),
        (10, '2026-07-06T10:00:00Z', '2026-07-06 11:30:00', 'All Hands Sync', NULL, 48, 'APPROVED', 1, 6),
        (11, '2026-07-06T13:00:00Z', '2026-07-06 14:00:00', 'Design Critique', NULL, 6, 'CANCELLED', 9, 3),
        (12, '2026-07-06T15:00:00Z', '2026-07-06 16:30:00', 'Budget Allocation', NULL, 10, 'APPROVED', 10, 5),
        (13, '2026-07-07T09:00:00Z', '2026-07-07 10:00:00', 'Daily Standup', NULL, 14, 'APPROVED', 14, 2),
        (14, '2026-07-07T11:00:00Z', '2026-07-07 12:30:00', 'DevOps Strategy', NULL, 8, 'PENDING', 10, 3),
        (15, '2026-07-07T14:00:00Z', '2026-07-07 15:00:00', 'Feedback Session', NULL, 3, 'APPROVED', 1, 9),
        (16, '2026-07-08T10:00:00Z', '2026-07-08 12:00:00', 'Board Meeting', NULL, 35, 'APPROVED', 1, 8),
        (17, '2026-07-08T13:30:00Z', '2026-07-08 14:30:00', 'Project Handover', NULL, 5, 'APPROVED', 4, 1),
        (18, '2026-07-08T15:00:00Z', '2026-07-08 16:00:00', 'UI/UX Alignment', NULL, 7, 'PENDING', 9, 5),
        (19, '2026-07-09T11:00:00Z', '2026-07-09 12:00:00', 'Security Audit', NULL, 4, 'APPROVED', 3, 2),
        (20, '2026-07-09T14:00:00Z', '2026-07-09 15:30:00', 'Sales Pitch Prep', NULL, 18, 'APPROVED', 12, 3)
        ON CONFLICT DO NOTHING;

        SELECT setval(pg_get_serial_sequence('bookings', 'id'), COALESCE((SELECT MAX(id) FROM bookings), 1));
    `)
}


export const down = (pgm)=>{
    pgm.sql(`
        DELETE FROM bookings WHERE id BETWEEN 1 AND 20;
    `);

    pgm.sql(`
        DELETE FROM meeting_room WHERE id BETWEEN 1 AND 10;
    `);

    pgm.sql(`
        DELETE FROM employees WHERE id BETWEEN 1 AND 15;
    `);
}