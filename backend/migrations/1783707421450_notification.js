export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE notification (
        id SERIAL PRIMARY KEY,
        "recipientId" INTEGER NOT NULL,
        "bookingId" INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS notification CASCADE;
  `);
};
