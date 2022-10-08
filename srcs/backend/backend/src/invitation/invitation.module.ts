import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from "./invitation.controller";
import { JwtModule } from "@nestjs/jwt";
import { ProfileModule } from "../profile/profile.module";

@Module({
  imports:[JwtModule, ProfileModule],
  providers: [InvitationService],
  controllers: [InvitationController]
})
export class InvitationModule {}
