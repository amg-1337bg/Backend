import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { dm_to, dto_block, dto_msg_dm } from '../dto/create-room.dto';

@Injectable()
export class DmService {
    constructor(private prisma: PrismaService){}

    async check_create_room_dm(from: string, to: string){
        const dm_name = await this.prisma.room.count({
            where:{
                OR: [
                    {
                    name: from + '+' + to + '+',
                    },
                    {
                    name: to + '+' + from + '+',
                    },
                ]
            }
        })
        if (dm_name == 1){
            const get_name = await this.prisma.room.findFirst({
                where:{
                    OR: [
                    {
                        name: from + '+' + to + '+',
                    },
                    {
                        name: to + '+' + from + '+',
                    },
                    ]
                },
                select:{
                    name: true,
                }
            })
            return(get_name.name);
        }
        else if (dm_name == 0){
            const add_dm_room = await this.prisma.room.create({
              data: {
                name: from + '+' + to + '+', type: 'dm', password: '', owner: to,
              }
                
            });
            return(add_dm_room.name);
        }
    }

    async update_frienship(from: string, to: string)
    {
        await this.prisma.friendship.updateMany({
          where:{
            OR:[
              {
                id_user_1: from,
                id_user_2: to,
              },
              {
                id_user_1: to,
                id_user_2: from,
              },
            ]
          },
          data:{
            check_im: true,
          }
        })
    }

    async find_dm_room_name(from: string, to: string){
        const get_name = await this.prisma.room.findFirst({
            where:{
              OR: [
                {
                  name: from + '+' + to + '+',
                },
                {
                  name: to + '+' + from + '+',
                },
              ]
            },
            select:{
              name: true,
            }
          })
          return (get_name);
    }

    async create_msg(from: string, to: string, msg: dto_msg_dm){
        const newmsg = await this.prisma.directMessage.create({
            data:
              {creationDate: new Date(), from: from, to: to, content_msg: msg.msg},
            }); 
        return (newmsg);    
    }

    async check_friend(current_user: string, to: string)
    {
      const find = await this.prisma.friendship.findFirst({
        where:{
          id_user_1: current_user,
          id_user_2: to,
        },
        select:{
          type: true,
        }
      })
      return (find);
    }
    async check_not_blocked(from : string, to : dm_to)
    {
        const check = await this.prisma.friendship.findFirst({
          where :{
            id_user_1 : from,//current
            id_user_2 : to.to,
            stat_block : true
          }
        });
        return check;
    }
    async block_friend(current_user: string, to: string)
    {
      const check = await this.prisma.friendship.findFirst({
      where :{
        id_user_1 : current_user,//current
        id_user_2 : to
      }
      });
      const check2 = await this.prisma.friendship.findFirst({
        where :{
          id_user_1 : to,//current
          id_user_2 : current_user
        }
        });
      if (check && check2)
      {
        await this.prisma.friendship.update({
          where:{
            id : check.id,
          },
          data : {
            stat_block : true
          }
        });
        await this.prisma.friendship.update({
          where:{
            id : check2.id,
          },
          data : {
            stat_block : true
          }
        })

        const find_room = await this.prisma.room.findFirst({
          where:{
                name: current_user + '+' + to + '+',
            }
        });
        if (find_room)
        {
          await this.prisma.room.delete({
            where:{
              name: current_user + '+' + to + '+',
            }
          })
        }
        const find_room_r = await this.prisma.room.findFirst({
          where:{
                name: to + '+' + current_user + '+',
            }
        });
        if (find_room_r)
        {
          await this.prisma.room.delete({
            where:{
              name: to + '+' + current_user + '+',
            }
          })
        };

        // await this.prisma.directMessage.delete({
        //   where:{
        //     id: check.id,
        //   }
        // });
        // await this.prisma.directMessage.delete({
        //   where:{
        //     id: check2.id,
        //   }
        // });
      }
      else
        throw new WsException('Error to block friend');
        
    }

    async block_user_dm(current_user: string, to: string)
    {
      const check = await this.prisma.friendship.findFirst({
        where :{
          id_user_1 : current_user,//current
          id_user_2 : to
          //type: 'user',
        }
      });
      const check2 = await this.prisma.friendship.findFirst({
        where :{
          id_user_1 : to,//current
          id_user_2 : current_user
          //type: 'user',
        }
      });
      // if(!check && !check2)
      // {
      //   await this.prisma.friendship.create({
      //     data : {
      //     id_user_1 : current_user,
      //     id_user_2 : to,
      //     stat_block : true,
      //     type : "user"
      //     }
      //   });
      //   await this.prisma.friendship.create({
      //     data : {
      //     id_user_1 : to,
      //     id_user_2 : current_user,
      //     stat_block : true,
      //     type : "user"
      //     }
      //   })
      // }
      if(check && check2){
        await this.prisma.friendship.update({
          where:{
            id : check.id,
          },
          data : {
            stat_block : true
          }
        });
        await this.prisma.friendship.update({
          where:{
            id : check2.id,
          },
          data : {
            stat_block : true
          }
        });
        const find_room = await this.prisma.room.findFirst({
          where:{
                name: current_user + '+' + to + '+',
            }
        });
        if (find_room)
        {
          await this.prisma.room.delete({
            where:{
              name: current_user + '+' + to + '+',
            }
          })
        }
        else{
          const find_room_r = await this.prisma.room.findFirst({
            where:{
                  name: to + '+' + current_user + '+',
              }
          });
          if (find_room_r)
          {
            await this.prisma.room.delete({
              where:{
                name: to + '+' + current_user + '+',
              }
            })
          }
        }
      }
    }
}
