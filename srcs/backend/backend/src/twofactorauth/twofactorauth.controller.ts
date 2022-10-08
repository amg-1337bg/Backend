import {
  Controller,
  UseFilters,
  UseGuards,
  Get,
  Post,
  Req,
  Res,
  Body,
  UnauthorizedException,
  HttpException, HttpStatus
} from "@nestjs/common";
import { HttpExceptionFilter } from "../auth/filters/http-exception.filter";
import { IntraJwtGuard } from "../auth/guards/intra_jwt.guard";
import { TwofactorauthService } from "./twofactorauth.service";
import { TwoFactorCodeDto } from "./dtos/two-factor-code.dto";


@Controller('twofactorauth')
@UseGuards(IntraJwtGuard)
@UseFilters(HttpExceptionFilter)
export class TwofactorauthController {
  constructor(
    private twoFaservice: TwofactorauthService
  ) {}

  @Get('authenticate')
  async getAuthenticate(@Req() req, @Res() res){
    res.json({"Twofactor": "Authenticate"});
  }

  @Get('generate')
  async generate(@Req() req, @Res() res) {
    const qrcodeUrl =  await this.twoFaservice.generate(res, req.user);
    res.json(qrcodeUrl);
  }

  @Post('turnon')
  async turnOn(@Req() req, @Body() TfaCode: TwoFactorCodeDto) {
    await this.twoFaservice.turnOn(req.user, TfaCode.tfacode);
  }

  @Post('turnoff')
  async turnoff(@Req() req, @Body() tfacode: TwoFactorCodeDto) {
    await this.twoFaservice.turnOff(req.user, tfacode.tfacode);
  }

  @Post('authenticate')
  async authenticate(@Req() req, @Res() res, @Body() tfaCode: TwoFactorCodeDto) {
    const accessTokenCookie = await this.twoFaservice.authenticate(req.user, tfaCode.tfacode);
    res.cookie("Authorization", accessTokenCookie);
    res.status(HttpStatus.CREATED).send();
  }
}
