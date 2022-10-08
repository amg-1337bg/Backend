import { Controller, Get, Req, UseFilters, UseGuards } from "@nestjs/common";
import { HttpExceptionFilter } from "../auth/filters/http-exception.filter";
import { TwofactorauthController } from "../twofactorauth/twofactorauth.controller";
import { TwofactorGuard } from "../twofactorauth/guards/twofactor.guard";
import { UsersService } from "./users.service";
import { IntraJwtGuard } from "../auth/guards/intra_jwt.guard";

@Controller('users')
@UseFilters(HttpExceptionFilter)
@UseGuards(TwofactorGuard)
// @UseGuards(IntraJwtGuard)
export class UsersController {
  constructor(
    private userService : UsersService
  ) {}

  @Get()
  async getAllUsers(@Req() req) {
    return await this.userService.getAllUsers(req.user);
  }
}
