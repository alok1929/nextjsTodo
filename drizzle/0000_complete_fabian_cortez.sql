CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  submit_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);