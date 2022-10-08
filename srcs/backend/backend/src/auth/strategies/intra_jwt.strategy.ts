import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";

export class IntraJwtStrategy extends PassportStrategy(Strategy, "intrajwt") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                IntraJwtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWTSECRET,
        });
    }

    private static extractJWT(req): string | null {
        if (req && req.cookies) {
            return req.cookies.Authorization;
        }
        return null;
    }

    async validate(payload: any) {
        return payload.userId;
    }
}