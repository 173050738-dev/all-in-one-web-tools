-- Korelyy Auth D1 Schema
-- Run locally: wrangler d1 execute korelyy-users --local --file=./schema.sql
-- Run production: wrangler d1 execute korelyy-users --file=./schema.sql

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_normalized TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  locale TEXT DEFAULT 'en',
  avatar_url TEXT,
  auth_provider TEXT NOT NULL DEFAULT 'email',
  google_sub TEXT UNIQUE,
  email_verified_at INTEGER,
  last_login_at INTEGER,
  last_login_ip TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  subscription_tier TEXT NOT NULL DEFAULT 'free',
  is_banned INTEGER NOT NULL DEFAULT 0,
  banned_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_users_email_norm ON users (email_normalized);
CREATE INDEX IF NOT EXISTS idx_users_google_sub ON users (google_sub);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at DESC);

CREATE TABLE IF NOT EXISTS favorites (
  user_id TEXT NOT NULL,
  tool_slug TEXT NOT NULL,
  tool_id TEXT,
  favorited_at INTEGER NOT NULL,
  source TEXT DEFAULT 'manual',
  PRIMARY KEY (user_id, tool_slug),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites (user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_fav_at ON favorites (favorited_at DESC);

CREATE TABLE IF NOT EXISTS likes (
  user_id TEXT NOT NULL,
  tool_slug TEXT NOT NULL,
  liked_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, tool_slug),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_history (
  user_id TEXT NOT NULL,
  tool_slug TEXT NOT NULL,
  accessed_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, tool_slug),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_history_user_access ON user_history (user_id, accessed_at DESC);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_normalized TEXT NOT NULL UNIQUE,
  user_id TEXT,
  locale TEXT DEFAULT 'en',
  subscribed_at INTEGER NOT NULL,
  unsubscribed_at INTEGER,
  source TEXT DEFAULT 'newsletter_form',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
