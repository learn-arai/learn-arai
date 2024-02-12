CREATE TABLE IF NOT EXISTS auth_user (
    id TEXT PRIMARY KEY,

    email TEXT UNIQUE NOT NULL,
    emal_verified BOOLEAN NOT NULL DEFAULT FALSE,
    hashed_password TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_session (
    id TEXT PRIMARY KEY,
    expires_at TIMESTAMPTZ NOT NULL,
    user_id TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS auth_email_verification (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    code CHAR(6) NOT NULL,
    user_id TEXT UNIQUE NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    email TEXT,
    expires_at TIMESTAMPTZ
);