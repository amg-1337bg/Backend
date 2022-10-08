import { Module } from '@nestjs/common';
import {ProfileService} from "./profile.service";
import {ProfileController} from "./profile.controller";
import { JwtModule } from "@nestjs/jwt";


@Module({
    imports:[
      JwtModule
    ],
    exports:[
        ProfileService
    ],
    providers:[
        ProfileService
    ],
    controllers:[
        ProfileController
    ]
})
export class ProfileModule {}
