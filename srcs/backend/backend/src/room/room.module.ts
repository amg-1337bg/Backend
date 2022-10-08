import { Module } from '@nestjs/common';
import { StatusModule } from 'src/status/status.module';
import { DmModule } from './dm/dm.module';
import { DmService } from './dm/dm.service';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { JwtModule } from "@nestjs/jwt";
import { ProfileModule } from "../profile/profile.module";

@Module({
  imports:[StatusModule, JwtModule, ProfileModule,DmModule],
  controllers: [RoomController],
  providers: [RoomService,DmService]
})
export class RoomModule {}
