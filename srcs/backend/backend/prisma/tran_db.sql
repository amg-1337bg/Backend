-- -------------------------------------------------------------
-- TablePlus 4.6.8(424)
--
-- https://tableplus.com/
--
-- Database: tran_db
-- Generation Time: 2022-09-26 20:29:54.3300
-- -------------------------------------------------------------


INSERT INTO "public"."Friendship" ("id", "id_user_1", "id_user_2", "stat_block", "type", "check_im") VALUES
(1, 'ssghuri', 'sbarka', 'f', 'friend', 'f'),
(2, 'sbarka', 'ssghuri', 'f', 'friend', 'f'),
(3, 'ssghuri', 'bsanaoui', 'f', 'friend', 'f'),
(4, 'bsanaoui', 'ssghuri', 'f', 'friend', 'f');


INSERT INTO "public"."User" ("id", "login", "username", "avatar", "email", "token_google_auth", "losses", "wins", "ladder_level") VALUES
(1, 'ssghuri', 'ssghuri', 'https://cdn.intra.42.fr/users/ssghuri.jpg', 'ssghuri@student.1337.ma', NULL, 0, 0, 0),
(2, 'sbarka', 'sbarka', 'https://cdn.intra.42.fr/users/sbarka.jpg', 'sbarka@student.1337.ma', NULL, 0, 0, 0),
(3, 'bsanaoui', 'bsanaoui', 'https://cdn.intra.42.fr/users/bsanaoui.jpg', 'bsanaoui@student.1337.ma', NULL, 0, 0, 0);

