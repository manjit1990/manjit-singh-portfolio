CREATE TABLE IF NOT EXISTS demo_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  app_type TEXT NOT NULL,
  budget TEXT,
  idea TEXT NOT NULL,
  features TEXT NOT NULL,
  ip_hash TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_demo_requests_created_at
ON demo_requests(created_at);

CREATE INDEX IF NOT EXISTS idx_demo_requests_ip_created_at
ON demo_requests(ip_hash, created_at);
