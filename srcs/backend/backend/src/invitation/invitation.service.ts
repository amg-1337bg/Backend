import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { getSystemErrorName } from "util";
import { HttpExceptionFilter } from "../auth/filters/http-exception.filter";

@Injectable()
export class InvitationService {
  constructor(private prisma: PrismaService) {}

  async getInvitation(user: string) {
    let ret: any[] = [];
    const invitations = await this.prisma.invitationfriend.findMany({
      where: {
        id_user_receiver: user
      }
    })
    for (const invitation of invitations) {
      const sender = await this.prisma.user.findUnique({
        where: {
          login: invitation.id_user_sender
        }
      })
      const { login, avatar, username } = sender;
      ret.push({
        login: login,
        username: username,
        avatar: avatar
      });
    }
    return ret;
  }

  async sendInvitation(user: string, sendTo :string ) {
    if (user === sendTo)
      throw new HttpException("You cannot send invitation to yourself", HttpStatus.FORBIDDEN);
    const check = await this.prisma.friendship.findFirst({
      where:{
        OR: [{
          id_user_1: user,
          id_user_2: sendTo
        },{
          id_user_1: sendTo,
          id_user_2: user
        }]
      }
    });
    if (check && check.stat_block)
      throw new HttpException((`You Blocked him(her), Or he(she) blocked you`), HttpStatus.FORBIDDEN);
    else if (check && check.type === 'friend') {
      throw new HttpException("You're already Friends", HttpStatus.FORBIDDEN);
    }
    // what if the receiver has already sent invitation before.
    const alreadyInvited = await this.prisma.invitationfriend.findFirst({
      where: {
        id_user_receiver: user,
        id_user_sender: sendTo
      }
    })
    if (alreadyInvited)
      throw new HttpException("He already invited you", HttpStatus.FORBIDDEN);
    try {
      await this.prisma.invitationfriend.create({
        data: {
          id_user_receiver: sendTo,
          id_user_sender: user
        },
      })
    } catch (e) {}
  }

  async deleteInvitation(user : string, sender : string) {
    const toDelete = await this.prisma.invitationfriend.findFirst({
      where: {
        id_user_receiver: user,
        id_user_sender: sender
      }
    });
    if (!toDelete)
      throw new HttpException("There is no invitation from " + sender, HttpStatus.FORBIDDEN);
    await this.prisma.invitationfriend.delete({
      where:{
        id_user_sender_id_user_receiver: toDelete
      }
    });
  }


  async acceptInvitation(user: string, sender: string) {
    await this.deleteInvitation(user, sender);
    const check = await this.prisma.friendship.findFirst({
      where:{
        type: 'user',
          id_user_1: user,
          id_user_2: sender
      }
    });
    const check2 = await this.prisma.friendship.findFirst({
      where:{
        type: 'user',
        id_user_1: sender,
        id_user_2: user
      }
    });
    if (check) {
      await this.prisma.friendship.update({
        where: {
          id : check.id
        }, data:{
          type: "friend"
        }
      })
    }
    if (check2) {
      await this.prisma.friendship.update({
        where: {
          id : check2.id
        }, data:{
          type: "friend"
        }
      })
    }
    if (!check && !check2) {
      await this.prisma.friendship.create({
        data: {
          id_user_1: user,
          id_user_2: sender,
          stat_block: false,
          type: "friend"
        }
      });
      await this.prisma.friendship.create({
        data: {
          id_user_1: sender,
          id_user_2: user,
          stat_block: false,
          type: "friend"
        }
      });
    }
  }

  async declineInvitation(user: string, sender: string) {
    await this.deleteInvitation(user , sender);
  }
}
