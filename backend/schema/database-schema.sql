CREATE TABLE auth_user (
    id TEXT PRIMARY KEY
)

CREATE TABLE user_session (
    id TEXT PRIMARY KEY,
    expires_at TIMESTAMPTZ NOT NULL,
    user_id TEXT NOT NULL REFERENCES auth_user(id)
)