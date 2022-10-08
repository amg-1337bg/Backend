import {
  Controller,
  UseFilters,
  UseGuards,
  Get,
  Post,
  Param,
  Req,
  Res,
  Query,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { IntraJwtGuard } from "../auth/guards/intra_jwt.guard";
import { HttpExceptionFilter } from "../auth/filters/http-exception.filter";
import { InvitationService } from "./invitation.service";
import { TwofactorGuard } from "../twofactorauth/guards/twofactor.guard";

@Controller('invitation')
// @UseGuards(IntraJwtGuard)
@UseGuards(TwofactorGuard)
@UseFilters(HttpExceptionFilter)
export class InvitationController {
  constructor(
    private invitationService: InvitationService
  ) {}

  @Get()
  async getInvitations(@Req() req) {
    return await this.invitationService.getInvitation(req.user);
  }

  @Post()
  async sendInvitation(@Req() req, @Query('sendto') sendTo: string) {
    if (!sendTo)
      throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
    await this.invitationService.sendInvitation(req.user, sendTo);
  }

  @Post('accept')
  async acceptInvitation(@Req() req, @Query('sender') sender: string) {
    if (!sender)
      throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
    await this.invitationService.acceptInvitation(req.user, sender)
  }

  @Post('decline')
  async declineInvitation(@Req() req, @Query('sender') sender: string) {
    if (!sender)
      throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
    await this.invitationService.declineInvitation(req.user, sender)
  }
}
