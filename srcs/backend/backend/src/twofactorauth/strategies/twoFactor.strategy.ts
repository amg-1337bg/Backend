import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from "../../prisma/prisma.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { TwofactorauthService } from "../twofactorauth.service";

@Injectable()
export class TwoFactorStrategy extends PassportStrategy(Strategy,  'Jwt2fa'){
  constructor(
    private readonly prisma: PrismaService,
    private readonly ServiceStack: TwofactorauthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        TwoFactorStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTSECRET,
    });
  }

  private static extractJWT(req): string | null {
    if (req && req.cookies) return req.cookies.Authorization;
    return null;
  }

  async validate(payload: any) {
    const user = await this.ServiceStack.findUser(payload.userId);
    if (user && (!user.tfaEnabled || payload.isSecondFactorAuthenticated)) {
      return payload.userId;
    }
  }
}