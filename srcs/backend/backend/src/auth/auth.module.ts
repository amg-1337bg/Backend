import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {IntraStrategy} from "./strategies/intra.strategy";
import {JwtModule} from "@nestjs/jwt";
import { IntraJwtStrategy } from './strategies/intra_jwt.strategy';
import { AuthController } from './auth.controller';
import { ProfileModule } from "../profile/profile.module";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWTSECRET,
            signOptions: {
                expiresIn: "1d"
            }
        }),
      ProfileModule
    ],
    providers: [
      AuthService,
      IntraStrategy,
        IntraJwtStrategy
    ],
    controllers: [AuthController]
})
export class AuthModule {}
