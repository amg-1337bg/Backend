import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import fs, { createReadStream } from "fs";
import { join } from "path";

@Injectable()
export class ProfileService {
    constructor(
        private prisma: PrismaService
    ) {
    }

    async findUser(userId : string) {
        return await this.prisma.user.findUnique({
            where:{
                login: userId
            }
        });
    }

    async get_Achievements(user: string) : Promise<Array<any>> {
        var ret: Array<any> = [];
        const all = await this.prisma.achievement.findMany();
        const achieved = await this.prisma.userAchiev.findMany({
            where: {
                user_id: user
            }
        });
        for(const achieve of all) {
            if(achieved.find((ele) => {
                return ele.achie_id === achieve.achiev_id
            }
            )) {
                ret.push({
                   achieve_id: achieve.achiev_id,
                   achieve_name: achieve.name,
                   description: achieve.description,
                   achieved: true
                });
            } else {
                ret.push({
                    achieve_id: achieve.achiev_id,
                    achieve_name: achieve.name,
                    description: achieve.description,
                    achieved: false
                })
            }
        }
        return ret;
    }

    async getMatch_history(user: string): Promise<Array<any>> {
        let matches : Array<any> = [];
        const user_matches = await this.prisma.match_history.findMany({
            where: {
                OR: [
                    {
                        loser_id: user
                    },
                    {
                        winner_id: user
                    },
                ]
            }
        })
        for (const match of user_matches) {
            if (match.winner_id === user)
            {
                const opponent = await this.findUser(match.loser_id);
                matches.push({
                    avatar: opponent.avatar,
                    username: opponent.username,
                    my_score: match.score_winner,
                    opp_score: match.score_loser,
                    date: new Date(match.match_date).toDateString(),
                    game: match.mod,
                })
            } else {
                const opponent = await this.findUser(match.winner_id);
                matches.push({
                    avatar: opponent.avatar,
                    username: opponent.username,
                    my_score: match.score_loser,
                    opp_score: match.score_winner,
                    date: new Date(match.match_date).toDateString(),
                    game: match.mod,
                })
            }
        }
        return matches;
    }

    async getInfos(user: string) : Promise<any> {
        const user_info = await this.findUser(user);
        if (!user_info)
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        const matche_lost = await this.prisma.match_history.findMany({
            where: {
               loser_id: user,
            }
        });
        const matche_won = await this.prisma.match_history.findMany({
            where: {
                winner_id: user,
            }
        });
        let total_goals = 0, in_goals = 0;
        matche_lost.forEach((ele) => {
            total_goals += ele.score_loser;
            in_goals += ele.score_winner;
        });
        matche_won.forEach((ele) => {
            total_goals += ele.score_winner;
            in_goals += ele.score_loser;
        });

        const friend = await this.prisma.friendship.findMany({
            where:{
                id_user_1: user,
                AND: {
                    type: "friend"
                }
            }
        })
        const ratio = (matche_won.length / (matche_won.length + matche_lost.length)) * 100;

        return {
            login: user,
            username: user_info.username,
            avatar: user_info.avatar,
            level: (total_goals / 20).toFixed(2),
            total_matches: matche_lost.length + matche_won.length,
            friends: friend.length,
            ratio: (isNaN(ratio)) ? 0 : ratio.toFixed(2),
            wins: matche_won.length,
            loses: matche_lost.length,
            goals: total_goals,
            in_goals: in_goals
        }
    }

    async change_username(user : string, change_to : string) {
        const check = await this.prisma.user.findUnique({
            where: {
                username: change_to
            }
        });
        if (check)
            throw new HttpException("Username already in use", HttpStatus.FORBIDDEN);
        const updateUser = await this.prisma.user.update({
            where: {
                login: user,
            },
            data: {
                username: change_to,
            },
        })
    }

    async change_avatar(user : string, file : Express.Multer.File) {
        const fs = require('fs');
        const player = await this.prisma.user.findUnique({
            where: {
                login: user
            }
        });
        if (!player)
            throw new HttpException("Username Not Found", HttpStatus.NOT_FOUND);
        const extract = player.avatar.split('/');
        if (extract[extract.length - 1] !== file.filename) {
            await fs.unlink( process.cwd() + "/" + extract[extract.length - 2] + "/" + extract[extract.length - 1], (err) => {
            });
        }
        await this.prisma.user.update({
            where: {
                login: user
            },
            data: {
                avatar: process.env.AVATAR_SRC + "avatars/" + file.filename,
            }
        });
        return process.env.AVATAR_SRC + "avatars/" + file.filename;
    }

    async getAvatar(user : string, id: string) {
        return createReadStream(join(process.cwd(), 'avatars/', id));
    }

    async getNavbar(userId : string) {
        const user = await this.findUser(userId);
        if (!user)
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        const matche_lost = await this.prisma.match_history.findMany({
            where: {
                loser_id: userId,
            }
        });
        const matche_won = await this.prisma.match_history.findMany({
            where: {
                winner_id: userId,
            }
        });
        let total_goals = 0, in_goals = 0;
        matche_lost.forEach((ele) => {
            total_goals += ele.score_loser;
            in_goals += ele.score_winner;
        });
        matche_won.forEach((ele) => {
            total_goals += ele.score_winner;
            in_goals += ele.score_loser;
        });

        const invits = await this.prisma.invitationfriend.findMany({
            where:{
                id_user_receiver: userId,
            }
        })
        return {
            level: (total_goals / 20).toFixed(2),
            invit_count: invits.length,
            tfa: user.tfaEnabled
        }
    }

}
