import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { StatusService } from "../status/status.service";
import { ProfileService } from "../profile/profile.service";

@Injectable()
export class UsersService {
  constructor(
    private prisma : PrismaService,
    private statusService: StatusService,
    private profileService: ProfileService,
  ) {}

  async getAllUsers(userId : string) {
    let allUsers : Array<any> = [];
    let onlines = this.statusService.getOnlineUser();
    let ingame = this.statusService.getInGameUser();
    let arr = [];

    const blocked = await this.prisma.friendship.findMany({
      where:{
        OR :[
          {
            id_user_1: userId,
          },{
            id_user_2: userId,
          }
        ], AND:{
          stat_block: true,
        }

      },
      // select:{
      //   id_user_2: true,
      // }
    }).then((value) =>{
      for(let i = 0; i < value.length; i++)
      {
        if (value[i].id_user_2 == userId)
          arr[i] = value[i].id_user_1;
        else
          arr[i] = value[i].id_user_2;

      }
    })
    const users = await this.prisma.user.findMany({
      where: {
        login: {
          notIn: arr
        }
      }
    });
    for (const user of users) {
      if (user.login !== userId) {
        const {login, avatar, username, level} = await this.profileService.getInfos(user.login);
        allUsers.push({
            login: login,
            avatar: avatar,
            username: username,
            level: level,
            status: this.statusService.find(user.login),
          }
        )
      }
    }
    return allUsers;
  }
}
