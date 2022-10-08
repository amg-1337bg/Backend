import { AuthGuard } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TwofactorGuard extends AuthGuard('Jwt2fa') {}