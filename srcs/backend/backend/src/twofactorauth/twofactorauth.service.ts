import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { JwtService } from "@nestjs/jwt";
import * as Process from "process";
import {reportUnhandledError} from "rxjs/internal/util/reportUnhandledError";

@Injectable()
export class TwofactorauthService {
  constructor(
    private prisma : PrismaService,
    private jwtService: JwtService,
  ) {}

  async findUser(userId: string) {
    return await this.prisma.user.findUnique({
      where: {
        login: userId
      }
    });
  }

  validate(token: string, secret: string) {
    return authenticator.verify({
      token: token,
      secret: secret
    });
  }

  async generate(stream : Response, userId: string) {
    const user = await this.findUser(userId);
    if (!user)
      throw new HttpException("There is no player with this id", HttpStatus.NOT_FOUND);
    authenticator.resetOptions();
    const secret = authenticator.generateSecret();
    const otpUrl = authenticator.keyuri(user.email, process.env.TWO_FACTOR_APP_NAME, secret);
    if (!user.twoFactorAuthentication) {
      await this.prisma.user.update({
        where: {
          login: userId
        },
        data:{
          twoFactorAuthentication: secret
        }
      })

    }
    return {"qrcodeUrl" : otpUrl};
  }

  async turnOn(userId: string, tfaCode: string){
    const user = await this.findUser(userId);
    if (!user)
      throw new HttpException("There is no player with this id", HttpStatus.NOT_FOUND);
    if (user.tfaEnabled)
      throw new HttpException("2FA already enabled", HttpStatus.FORBIDDEN);
    const isValid = this.validate(tfaCode, user.twoFactorAuthentication)
    if (!isValid)
      throw new HttpException("The Code is incorrect", HttpStatus.FORBIDDEN);
    await this.prisma.user.update({
      where: {
        login: userId
      },
      data:{
        tfaEnabled: true
      }
    })
  }

  async turnOff(userId : string, tfaCode: string) {
    const user = await this.findUser(userId);
    const isValid = this.validate(tfaCode, user.twoFactorAuthentication);
    if (!isValid)
      throw new HttpException("The Code is incorrect", HttpStatus.FORBIDDEN);
    await this.prisma.user.update({
      where: {
        login: userId
      },
      data:{
        twoFactorAuthentication: '',
        tfaEnabled: false
      }
    })
  }

  async authenticate(userId: string, tfacode: string) {
    const user = await this.findUser(userId)
    if (!user)
      throw new HttpException("User Not Found", HttpStatus.NOT_FOUND);
    const isValid = this.validate(tfacode, user.twoFactorAuthentication);
    if (!isValid)
      throw new HttpException("tfaCode Incorrect", HttpStatus.FORBIDDEN);
    return await this.getCookieWithJwtAccessToken(userId, true);
  }

  async getCookieWithJwtAccessToken(userId, isSecondFactorAuthenticated ) {
    const payload = { userId: userId, isSecondFactorAuthenticated: isSecondFactorAuthenticated };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWTSECRET,
      expiresIn: "1d"
    })
    return token;
  }
}
