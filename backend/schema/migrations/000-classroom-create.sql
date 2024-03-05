ALTER TABLE classroom
ADD COLUMN slug TEXT NOT NULL;

ALTER TABLE classroom
ADD CONSTRAINT "classroom_slug_key" UNIQUE (slug);

ALTER TABLE teach
ALTER COLUMN added_by DROP NOT NULL;

ALTER TABLE teach DROP CONSTRAINT "teach_classroom_id_fkey";
ALTER TABLE teach ADD CONSTRAINT "teach_classroom_id_fkey" FOREIGN KEY (classroom_id) REFERENCES classroom(id) ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE teach DROP CONSTRAINT "teach_user_id_fkey";
ALTER TABLE teach ADD CONSTRAINT "teach_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE NOT DEFERRABLE;