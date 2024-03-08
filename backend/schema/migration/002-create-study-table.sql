CREATE TABLE IF NOT EXISTS study (
    user_id         TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    section         INTEGER NOT NULL,
    classroom_id    TEXT NOT NULL REFERENCES classroom(id) ON DELETE CASCADE,
    is_class_hidden BOOLEAN DEFAULT FALSE
);