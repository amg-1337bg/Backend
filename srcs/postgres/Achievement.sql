-- -------------------------------------------------------------
-- TablePlus 4.8.8(450)
--
-- https://tableplus.com/
--
-- Database: tran_db
-- Generation Time: 2022-10-02 20:56:38.6980
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.


INSERT INTO "public"."Achievement" ("achiev_id", "name", "description") VALUES
(1, 'first step', 'play any match'),
(2, 'first of many', 'win your first match in rush mode'),
(3, 'classic champion', 'win your first match in classic mode'),
(4, 'getting serious!', 'score a total of 30 points.'),
(5, 'master of pong', 'win any match without letting you opponent score'),
(6, 'grand master', 'achieve level 50.');
