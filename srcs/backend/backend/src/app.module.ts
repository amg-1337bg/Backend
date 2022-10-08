import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppGateway } from './room/chat_rooms/chat_room.gateway';
import { RoomService } from './room/room.service';
import { DmGateway } from './room/dm/dm.gateway';
import { ChatRoomService } from './room/chat_rooms/chat_room.service';
import { DmModule } from './room/dm/dm.module';
import { DmService } from './room/dm/dm.service';
import {AuthModule} from "./auth/auth.module";
import { TwofactorauthController } from './twofactorauth/twofactorauth.controller';
import { TwofactorauthService } from './twofactorauth/twofactorauth.service';
import { TwofactorauthModule } from './twofactorauth/twofactorauth.module';
import { JwtService } from "@nestjs/jwt";
import { StatusModule } from './status/status.module';
import { ProfileModule } from "./profile/profile.module";
import { GameModule } from './game/game.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { InvitationModule } from "./invitation/invitation.module";

@Module({
  imports: [RoomModule, PrismaModule, AuthModule, ProfileModule, TwofactorauthModule, StatusModule, GameModule, UsersModule, InvitationModule],
  // controllers: [AppController],
  // providers: [AppService],
  providers: [AppGateway, RoomService, DmGateway, ChatRoomService, DmService, TwofactorauthService, JwtService, UsersService],
  controllers: [TwofactorauthController, UsersController],
})
export class AppModule {}