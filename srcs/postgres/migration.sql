-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "twoFactorAuthentication" TEXT,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "ladder_level" INTEGER NOT NULL DEFAULT 0,
    "tfaEnabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users_room" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_role" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "state_user" TEXT NOT NULL,

    CONSTRAINT "Users_room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "password" TEXT,
    "owner" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectMessage" (
    "id" SERIAL NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "content_msg" TEXT NOT NULL,

    CONSTRAINT "DirectMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageRoom" (
    "id" SERIAL NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "from" TEXT NOT NULL,
    "room_name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "content_msg" TEXT NOT NULL,

    CONSTRAINT "MessageRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" SERIAL NOT NULL,
    "id_user_1" TEXT NOT NULL,
    "id_user_2" TEXT NOT NULL,
    "stat_block" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL,
    "check_im" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitationfriend" (
    "id_user_sender" TEXT NOT NULL,
    "id_user_receiver" TEXT NOT NULL,

    CONSTRAINT "Invitationfriend_pkey" PRIMARY KEY ("id_user_sender","id_user_receiver")
);

-- CreateTable
CREATE TABLE "UserAchiev" (
    "achie_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "UserAchiev_pkey" PRIMARY KEY ("achie_id","user_id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "achiev_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("achiev_id")
);

-- CreateTable
CREATE TABLE "match_history" (
    "match_id" SERIAL NOT NULL,
    "mod" TEXT NOT NULL,
    "match_date" TIMESTAMP(3) NOT NULL,
    "winner_id" TEXT NOT NULL,
    "loser_id" TEXT NOT NULL,
    "score_winner" INTEGER NOT NULL,
    "score_loser" INTEGER NOT NULL,

    CONSTRAINT "match_history_pkey" PRIMARY KEY ("match_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_avatar_key" ON "User"("avatar");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_room_user_id_room_id_key" ON "Users_room"("user_id", "room_id");

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");

-- AddForeignKey
ALTER TABLE "Users_room" ADD CONSTRAINT "Users_room_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("login") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users_room" ADD CONSTRAINT "Users_room_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("login") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_from_fkey" FOREIGN KEY ("from") REFERENCES "User"("login") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_to_fkey" FOREIGN KEY ("to") REFERENCES "User"("login") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageRoom" ADD CONSTRAINT "MessageRoom_from_fkey" FOREIGN KEY ("from") REFERENCES "User"("login") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageRoom" ADD CONSTRAINT "MessageRoom_avatar_fkey" FOREIGN KEY ("avatar") REFERENCES "User"("avatar") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageRoom" ADD CONSTRAINT "MessageRoom_room_name_fkey" FOREIGN KEY ("room_name") REFERENCES "Room"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_id_user_1_fkey" FOREIGN KEY ("id_user_1") REFERENCES "User"("login") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_id_user_2_fkey" FOREIGN KEY ("id_user_2") REFERENCES "User"("login") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitationfriend" ADD CONSTRAINT "Invitationfriend_id_user_sender_fkey" FOREIGN KEY ("id_user_sender") REFERENCES "User"("login") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitationfriend" ADD CONSTRAINT "Invitationfriend_id_user_receiver_fkey" FOREIGN KEY ("id_user_receiver") REFERENCES "User"("login") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchiev" ADD CONSTRAINT "UserAchiev_achie_id_fkey" FOREIGN KEY ("achie_id") REFERENCES "Achievement"("achiev_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchiev" ADD CONSTRAINT "UserAchiev_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("login") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_history" ADD CONSTRAINT "match_history_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "User"("login") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_history" ADD CONSTRAINT "match_history_loser_id_fkey" FOREIGN KEY ("loser_id") REFERENCES "User"("login") ON DELETE CASCADE ON UPDATE CASCADE;
