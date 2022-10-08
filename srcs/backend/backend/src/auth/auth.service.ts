import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        ) {}

    async success(user: any) {
        const player = await this.prisma.user.findUnique({
            where: {
                login: user.login
            }
        });
        if (player) {
            const payload = {userId: player.login, isSecondFactorAuthenticated: (player.tfaEnabled) ? false : true};
            return {
                accessToken: this.jwtService.sign(payload),
                player_info: player,
                redirectTo: (player.tfaEnabled) ? process.env.ORIGIN + "/tfa" : process.env.ORIGIN + "/home",
            };
        }
        else {
            const check = await this.prisma.user.create({
                data: {
                    login: user.login,
                    username: user.login,
                    avatar: user.picture,
                    email: user.email
                }
            });
            const payload = {userId: check.login, isSecondFactorAuthenticated: true}
            return {
                accessToken: this.jwtService.sign(payload),
                player_info: check,
                redirectTo: process.env.ORIGIN + "/signup",
            };
        }
    }
}
