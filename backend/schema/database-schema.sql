CREATE TYPE PACKAGE_TYPE AS ENUM ('free', 'premium');

CREATE TABLE IF NOT EXISTS auth_user (
    id      TEXT PRIMARY KEY,
    package PACKAGE_TYPE NOT NULL DEFAULT 'free',

    email           TEXT UNIQUE NOT NULL,
    email_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    hashed_password TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_session (
    id         TEXT PRIMARY KEY,
    expires_at TIMESTAMPTZ NOT NULL,
    user_id    TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS auth_email_verification (
    id         TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    code       CHAR(6) NOT NULL,
    user_id    TEXT UNIQUE NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    email      TEXT,
    expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS file (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    uploaded_by TEXT NOT NULL REFERENCES auth_user(id),

    -- Access Control (up > down)
    public BOOLEAN NOT NULL DEFAULT TRUE,

    name      TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS classroom (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        TEXT NOT NULL UNIQUE,
    name        TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    thumbnail   TEXT NULL REFERENCES file(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT NOT NULL REFERENCES auth_user(id)
);

CREATE TABLE IF NOT EXISTS classroom_invite_code (
    id           TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id TEXT NOT NULL REFERENCES classroom(id),
    code         CHAR(6) NOT NULL,
    expires_at   TIMESTAMPTZ,
    section      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS teach (
    classroom_id TEXT NOT NULL REFERENCES classroom(id) ON DELETE CASCADE,
    user_id      TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,

    added_by TEXT REFERENCES auth_user(id),
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS study (
    user_id         TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    section         INTEGER NOT NULL,
    classroom_id    TEXT NOT NULL REFERENCES classroom(id) ON DELETE CASCADE,
    is_class_hidden BOOLEAN DEFAULT FALSE
);