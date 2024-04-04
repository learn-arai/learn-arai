BEGIN;

CREATE TYPE PACKAGE_TYPE AS ENUM ('free', 'premium');
CREATE TYPE USER_TYPE AS ENUM ('user', 'supporter');

CREATE TABLE IF NOT EXISTS auth_user (
    id      TEXT PRIMARY KEY,
    package PACKAGE_TYPE NOT NULL DEFAULT 'free',
    type    USER_TYPE NOT NULL DEFAULT 'user',    

    first_name   TEXT NOT NULL,
    last_name    TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,

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
    public                                  BOOLEAN NOT NULL DEFAULT TRUE,
    can_only_access_by_classroom_id         TEXT NULL, -- FK Below
    can_only_access_by_group_id             TEXT NULL, -- FK Below
    can_only_access_by_student_id           TEXT NULL, -- FK Below
    can_only_access_by_student_classroom_id TEXT NULL, -- FK Below

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

    default_group TEXT NULL, -- FK Below

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT NOT NULL REFERENCES auth_user(id),
    will_delete_in TIMESTAMPTZ NULL DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS teach (
    classroom_id TEXT NOT NULL REFERENCES classroom(id) ON DELETE CASCADE,
    user_id      TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,

    added_by TEXT REFERENCES auth_user(id),
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (classroom_id, user_id)
);

CREATE TABLE IF NOT EXISTS study (
    classroom_id    TEXT NOT NULL REFERENCES classroom(id) ON DELETE CASCADE,
    user_id         TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    is_class_hidden BOOLEAN DEFAULT FALSE,

    PRIMARY KEY (classroom_id, user_id)
);

CREATE TABLE IF NOT EXISTS classroom_group (
    id           TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    slug         TEXT NOT NULL UNIQUE,
    classroom_id TEXT NOT NULL REFERENCES classroom(id) ON DELETE CASCADE,
    title        TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT NOT NULL REFERENCES auth_user(id)
);

CREATE TABLE IF NOT EXISTS classroom_invite_code (
    id           TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id TEXT NOT NULL REFERENCES classroom(id) ON DELETE CASCADE,

    code         CHAR(6) NOT NULL UNIQUE,
    expires_at   TIMESTAMPTZ
);

-- group <====> user
CREATE TABLE IF NOT EXISTS classroom_group_member (
    group_id TEXT NOT NULL REFERENCES classroom_group(id) ON DELETE CASCADE,
    user_id  TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,

    added_by_invide_code TEXT REFERENCES classroom_invite_code(id) ON DELETE SET NULL,
    added_by_teacher     TEXT REFERENCES auth_user(id) ON DELETE CASCADE,
    added_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (group_id, user_id)
);

-- invite code <====> group
CREATE TABLE IF NOT EXISTS classroom_invite_code_group (
    code_id  TEXT NOT NULL REFERENCES classroom_invite_code(id) ON DELETE CASCADE,
    group_id TEXT NOT NULL REFERENCES classroom_group(id) ON DELETE CASCADE,

    PRIMARY KEY (code_id, group_id)
);

CREATE TABLE IF NOT EXISTS assignment (
    id           TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    slug         TEXT NOT NULL UNIQUE,
    classroom_id TEXT NOT NULL REFERENCES classroom(id) ON DELETE CASCADE,
    group_id     TEXT NOT NULL REFERENCES classroom_group(id) ON DELETE CASCADE,
    
    title        TEXT NOT NULL,
    description  TEXT NOT NULL,
    due_date     TIMESTAMPTZ NOT NULL,
    max_score    INTEGER NOT NULL,

    can_submit_after_due BOOLEAN NOT NULL DEFAULT TRUE,

    created_by TEXT NOT NULL REFERENCES auth_user(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignment_attachment (
    assignment_id TEXT NOT NULL REFERENCES assignment(id) ON DELETE CASCADE,
    file_id       TEXT NOT NULL REFERENCES file(id) ON DELETE CASCADE,

    PRIMARY KEY (assignment_id, file_id)
);

CREATE TABLE IF NOT EXISTS assignment_submission (
    assignment_id TEXT NOT NULL REFERENCES assignment(id) ON DELETE CASCADE,
    user_id       TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    score         INTEGER NULL,

    is_submitted BOOLEAN NOT NULL DEFAULT TRUE,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    PRIMARY KEY (assignment_id, user_id)
);

CREATE TABLE IF NOT EXISTS assignment_submission_attachment (
    assignment_id TEXT NOT NULL REFERENCES assignment(id) ON DELETE CASCADE,
    user_id       TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    file_id       TEXT NOT NULL REFERENCES file(id) ON DELETE CASCADE,

    PRIMARY KEY (assignment_id, user_id, file_id)
);

CREATE TABLE IF NOT EXISTS ticket (
    id           TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    slug         TEXT NOT NULL UNIQUE,
    user_id      TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    supporter_id TEXT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    is_close     BOOLEAN NOT NULL DEFAULT FALSE,

    title       TEXT NOT NULL,
    description TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ticket ====> message
CREATE TABLE IF NOT EXISTS ticket_message (
    id        TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id TEXT NOT NULL REFERENCES ticket(id) ON DELETE CASCADE,
    user_id   TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    
    content   TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE classroom
  ADD FOREIGN KEY (default_group)
  references classroom_group (id) ON DELETE CASCADE;

ALTER TABLE file
  ADD FOREIGN KEY (can_only_access_by_classroom_id)
  references classroom (id);

ALTER TABLE file
  ADD FOREIGN KEY (can_only_access_by_group_id)
  references classroom_group (id);

ALTER TABLE file
  ADD FOREIGN KEY (can_only_access_by_student_id)
  references auth_user (id);

ALTER TABLE file
  ADD FOREIGN KEY (can_only_access_by_student_classroom_id)
  references classroom (id);
  
COMMIT;
