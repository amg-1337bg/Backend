import { Module } from '@nestjs/common';
import { TwoFactorStrategy } from "./strategies/twoFactor.strategy";
import { TwofactorauthService } from "./twofactorauth.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { TwofactorauthController } from "./twofactorauth.controller";
import { ProfileService } from "../profile/profile.service";
import { ProfileModule } from "../profile/profile.module";


@Module({
  imports:[ProfileModule
    // JwtModule.register({
    //   secret: process.env.JWTSECRET,
    //   signOptions: {
    //     expiresIn: "1d"
    //   }
    // }),
  ],
  providers: [
    TwoFactorStrategy,
    TwofactorauthService,
    JwtService
  ],
  controllers:[TwofactorauthController],
  exports:[]
})
export class TwofactorauthModule {}
