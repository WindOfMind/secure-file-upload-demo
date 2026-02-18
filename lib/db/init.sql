CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  salt TEXT,
  type TEXT NOT NULL CHECK (type IN ('admin', 'staff'))
);
