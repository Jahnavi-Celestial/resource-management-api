export const up = async (pgm) => {
  pgm.sql(`
    CREATE TABLE roles (
        id SERIAL PRIMARY KEY,
        role_name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE permissions (
        id SERIAL PRIMARY KEY,
        permission_name TEXT NOT NULL UNIQUE
    );
  `);

  pgm.sql(`
    CREATE TABLE user_roles (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
        role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        CONSTRAINT unique_user_role UNIQUE (employee_id, role_id)
    );

    CREATE TABLE role_permission (
        id SERIAL PRIMARY KEY,
        role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
        CONSTRAINT unique_role_permission UNIQUE (role_id, permission_id)
    );
  `);

  pgm.sql(`
    INSERT INTO roles (id, role_name) VALUES 
    (1, 'admin'),
    (2, 'manager'),
    (3, 'employee')
    ON CONFLICT DO NOTHING;
    
    SELECT setval(pg_get_serial_sequence('roles', 'id'), COALESCE((SELECT MAX(id) FROM roles), 1));
  `);

  pgm.sql(`
    INSERT INTO user_roles (employee_id, role_id)
    SELECT id, 
           CASE 
               WHEN role = 'ADMIN' THEN 1
               WHEN role = 'MANAGER' THEN 2
               ELSE 3
           END
    FROM employees;
  `);

  pgm.sql(`
    ALTER TABLE employees DROP COLUMN role;
    DROP TYPE IF EXISTS employees_role_enum;
  `);

  pgm.sql(`
    INSERT INTO permissions (id, permission_name) VALUES
    (1, 'CREATE_BOOKING'), (2, 'CANCEL_BOOKING'), (3, 'APPROVE_BOOKING'), 
    (4, 'REJECT_BOOKING'), (5, 'VIEW_ALL_BOOKINGS'), (6, 'VIEW_BOOKING'),
    (7, 'VIEW_OWN_BOOKINGS'), (8, 'CREATE_ROOM'), (9, 'UPDATE_ROOM'), 
    (10, 'DELETE_ROOM'), (11, 'VIEW_ALL_ROOM'), (12, 'VIEW_ROOM'),
    (13, 'CREATE_EQUIPMENT'), (14, 'UPDATE_EQUIPMENT'), (15, 'DELETE_EQUIPMENT'), 
    (16, 'VIEW_ALL_EQUIPMENT'), (17, 'VIEW_EQUIPMENT'), (18, 'CREATE_EMPLOYEE'), 
    (19, 'UPDATE_EMPLOYEE'), (20, 'DELETE_EMPLOYEE'), (21, 'VIEW_ALL_EMPLOYEE'), 
    (22, 'VIEW_EMPLOYEE'), (23, 'ASSIGN_ROLE'), (24, 'REMOVE_ROLE'),
    (25, 'VIEW_MOST_BOOKED_ROOM'), (26, 'VIEW_BOOOING_PER_EMPLOYEE'), 
    (27, 'VIEW_EQUIPMENT_USAGE'), (28, 'VIEW_MONTHLY_STATICS'),
    (29, 'CREATE_PERMISSION'), (30, 'UPDATE_PERMISSION'), (31, 'DELETE_PERMISSION'),
    (32, 'CREATE_ROLE'), (33, 'UPDATE_ROLE'), (34, 'DELETE_ROLE'), 
    (35, 'ASSIGN_PERMISSION'), (36, 'REMOVE_PERMISSION'),
    (37, 'VIEW_ALL_PERMISSION')
    ON CONFLICT (permission_name) DO NOTHING;

    SELECT setval(pg_get_serial_sequence('permissions', 'id'), COALESCE((SELECT MAX(id) FROM permissions), 1));
  `);

  pgm.sql(`
    INSERT INTO role_permission (role_id, permission_id) VALUES
    (1, 18), (1, 19), (1, 20), (1, 8), (1, 9), (1, 10), (1, 13), (1, 14), (1, 15),
    (1, 23), (1, 24), (1, 29), (1, 30), (1, 31), (1, 32), (1, 33), (1, 34), (1, 35), (1, 36),
    (1, 37),

    (3, 1), (3, 2), (2, 3), (2, 4), (1, 5), (2, 5), (1, 6), (2, 6), (3, 6), (3, 7), 
    (1, 11), (2, 11), (3, 11), (1, 12), (2, 12), (3, 12), (1, 16), (2, 16), (3, 16), 
    (1, 17), (2, 17), (3, 17), (1, 21), (2, 21), (1, 22), (2, 22), (1, 25), (2, 25), 
    (3, 25), (1, 26), (2, 26), (1, 27), (2, 27), (2, 28)
    ON CONFLICT DO NOTHING;
  `);
};

export const down = async (pgm) => {
  pgm.sql(`
    CREATE TYPE employees_role_enum AS ENUM ('ADMIN', 'MANAGER', 'EMPLOYEE');
    ALTER TABLE employees ADD COLUMN role employees_role_enum NOT NULL DEFAULT 'EMPLOYEE';
  `);

  pgm.sql(`
    UPDATE employees e
    SET role = UPPER(r.role_name)::employees_role_enum
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.employee_id = e.id;
  `);

  pgm.sql(`
    DROP TABLE IF EXISTS role_permission CASCADE;
    DROP TABLE IF EXISTS user_roles CASCADE;
    DROP TABLE IF EXISTS permissions CASCADE;
    DROP TABLE IF EXISTS roles CASCADE;
  `);
};
