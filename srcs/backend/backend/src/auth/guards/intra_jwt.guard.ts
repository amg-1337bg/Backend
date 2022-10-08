import {Injectable} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";

@Injectable()
export class IntraJwtGuard extends AuthGuard("intrajwt") {}