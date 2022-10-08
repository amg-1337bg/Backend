import {ExceptionFilter, Catch, ArgumentsHost, HttpException, UnauthorizedException} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from "@nestjs/jwt";
import { ProfileService } from "../../profile/profile.service";
import { request } from "http";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(
      private jwtService: JwtService,
      private profileService: ProfileService,
    ) {}
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        console.log("Status ",  status);

        if (status === 401){
            // response.header("Access-Control-Allow-Origin", "*");
            const tokenValue : any = this.jwtService.decode(request.cookies.Authorization)
            if (tokenValue && !(tokenValue.isSecondFactorAuthenticated)) {
                response.status(401).json({"redirectTo" : "/tfa"});
            } else
                response.status(401).json({"redirectTo" : "/"});
        }
        else
            response.status(status).json(exception);

    }
}