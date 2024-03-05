CREATE TABLE IF NOT EXISTS auth_user (
    id TEXT PRIMARY KEY,

    email TEXT UNIQUE NOT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
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

CREATE TABLE IF NOT EXISTS classroom (
    id TEXT PRIMARY KEY,
    description TEXT,
    schedule TEXT,
    code TEXT,
    start_at TIME NOT NULL,
    end_at TIME NOT NULL,
    teacher_id TEXT auth_user(id) ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS student {
    id TEXT PRIMARY KEY,
    classroom_id TEXT classroom(id) ON DELETE CASCADE,
    user_id TEXT auth_user(id) ON DELETE CASCADE,
    isClassroomHidden BOOLEAN,
    section SMALLINT
};