import {Controller, Get, Post, Req, Res, UseFilters, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import { IntraGuard} from "./guards/intra.guard";
import { IntraJwtGuard } from "./guards/intra_jwt.guard"
import {AuthGuard} from "@nestjs/passport";
import {HttpExceptionFilter} from "./filters/http-exception.filter";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

    @UseGuards(IntraGuard)
    @Post()
    login(@Req() req) {}

    @UseGuards(IntraGuard)
    @UseFilters(HttpExceptionFilter)
    @Get("success")
    async success(@Req() req, @Res() res) {
        const player = await this.authService.success(req.user);
        res.cookie("Authorization", player.accessToken);
        res.cookie("login", player.player_info.login);
        res.cookie("avatar", player.player_info.avatar);
        res.cookie("username", player.player_info.username);
        // res.json({Message: "All Good"});
        res.redirect(player.redirectTo);
    }
}
