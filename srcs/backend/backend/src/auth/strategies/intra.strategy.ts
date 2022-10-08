import {PassportStrategy} from "@nestjs/passport";
import {Strategy, Profile} from "passport-42";


export class IntraStrategy extends PassportStrategy(Strategy, "42") {
    constructor() {
        super({
            clientID: process.env.UID,
            clientSecret: process.env.SECRET,
            callbackURL: process.env.CALLBACKURL,
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ) : Promise<any> {
        const { username, displayName, photos, emails } = profile;
        const user = {
            login: username,
            fullName: displayName,
            picture: photos[0].value,
            email: emails[0].value,
            accessToken: accessToken
        };
        return user;
    }
}