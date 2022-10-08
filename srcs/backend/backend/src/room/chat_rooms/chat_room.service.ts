import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { dto_admin,dto_ban_mute, dto_changePass, dto_global, dto_msg,  dto_user_room, dto_invite } from '../dto/create-room.dto';

@Injectable()
export class ChatRoomService {
    constructor(private prisma: PrismaService){}

    async add_user_to_room(infos: dto_global)
    {
        let new_join = await this.prisma.users_room.findFirst({
          where: {
            user_id: infos.from,
            room_id : infos.to,
            
          }
      });
      if (new_join && (new_join.state_user === "banned" || new_join.state_user === "kicked"))
          return null;
      if (new_join === null)
      {
          new_join = await this.prisma.users_room.create({
            data:
            { 
              user_id: infos.from,
              user_role: "user", 
              room_id : infos.to,
              state_user: ""
            }
          }); 
      }

      return (new_join);
    }
    async BlockedMe(user :string)
    {
      let arr = [];
      const blockedme = await this.prisma.friendship.findMany({
        where : {
          id_user_2 : user , //current
          stat_block: true,
        },
        select : {
          id_user_1 : true,
        }
      }).then((value) =>{
        for(let i = 0; i < value.length; i++)
        {
          arr[i] = value[i].id_user_1; 
        }
      });
      return arr;
    }
    async add_msg_room(from: string, to: string, infos: dto_msg ){
      let message;
      const not_ban = await  this.prisma.users_room.findFirst({
          where : {
            user_id: from,
            room_id : to,
            NOT :[
              { state_user : "banned"},
              { state_user : "muted"},
              { state_user : "kicked"}
            ]
          }
      }); 

      if (not_ban)
      {
            message = await this.prisma.messageRoom.create ({
            data : {
              creationDate : new Date(),
              from : from,
              room_name : to,
              content_msg : infos.msg,
              avatar :infos.avatar,
            }
          });
      }
      return message;
    }

    async ban_mute_user_in_room(room: string, who: string, action : string, current_role : string)
    {
      let ret ;
      if(current_role === "admin")
      {
          ret = await this.prisma.users_room.findFirst({
              where : {
                user_id : who,
                room_id : room,
              
                NOT : [
                    {state_user: "banned"},
                    {state_user: "muted"},
                    {user_role : "admin"},
                    {user_role : "owner"}
                ]
              },
          });
      }
      else if ( current_role === "owner")
      {
          ret = await this.prisma.users_room.findFirst({
            where : {
              user_id : who,
              room_id : room,
            
              NOT : [
                {state_user: "banned"},
                {state_user: "muted"},
              ]
            },
        });
      }

      if (ret)
      {
          return await this.prisma.users_room.update({
            where: {
                  user_id_room_id : {
                    user_id : who,
                    room_id : room,
                }
            },
            data: {
                state_user: action,
            },
          });
        }
        return ret ;
    }


    async update_ban_mute_user_in_room(room : string , who : string){
      return await this.prisma.users_room.update({
        where : {
            user_id_room_id : {
              user_id : who,
              room_id : room
            }
          },
          data : {
            state_user : ""
          }
        })
    }

    async setAdmin(infos : dto_admin, room: string)
   {
      const ret = await this.prisma.users_room.findFirst({
        where : {
            user_id : infos.new_admin,
            room_id : room,
            NOT : [
              {user_role : "admin"},
              {state_user : "kicked"}, 
            ]
        },
      });
      if(ret)
      {
          return  await this.prisma.users_room.update({
            where : {
                user_id_room_id : {
                    user_id : infos.new_admin,
                    room_id : room,
                },
            },
            data : {
              user_role :"admin"
            }
          });
      }
      return ret;
    
   }

   async getOwner(user : string , room : string)
  {
    const find = await this.prisma.users_room.findFirst({
      where :{
          room_id : room,
          user_id :user,
          user_role : "owner",
      }
    })
    return find;
  }

   async leaveRoom(role: string, room: string, user: string)
   {
     if (role === "owner")
     {
         return this.leaveOwner(room, user);
     }
     else
       return this.leave(room, user);

   }


  async getNewOwner(room : string)
  {
    return await this.prisma.room.findFirst({
      where : {
          name : room
      },
      select : {
        owner : true
      }
    })
  }

  async leaveOwner(room: string, user: string )
  {
      const find = await this.prisma.users_room.findFirst({ 
        orderBy : {user_role : "asc"} ,
          where : {
            room_id : room,
            OR : [ {user_role : "admin"} , {user_role : "user"} ],
            NOT : {
              state_user : "kicked"
            }
          }
      }); 

    if (!find)
    {
        return await this.prisma.room.delete({
          where: {
            name : room,
          },
      });
    }
    else
    {
        await this.prisma.users_room.delete({
          where : {
              user_id_room_id :{
                user_id : user,
                room_id : room
              },
          }
        });
        return await this.prisma.users_room.update({
          where : {
            user_id_room_id : {
              user_id : find.user_id,
              room_id : find.room_id
            }
          },
          data : {
            user_role : "owner",
            room : {
              update : {
                owner : find.user_id
              }
            }
          },
          include : {room : true},
      });
  }
  }
   async leave(room: string, user: string)
    {
      return await this.prisma.users_room.delete ({
        where : {
            user_id_room_id :{
              user_id : user,
              room_id : room
            },
        }
      });
    }



    async disablePassword(user : string , room : string)
    {
      const data = await  this.prisma.room.findFirst({
        where : {
            name : room,
            type : "protected",
        }
      });

      if(data)
          return await  this.prisma.room.update({
          where :{
            name :  room,
          },
          data :{
            type : "public",
            password : ""
          }
      });
      return data;
    }

    async changePassword(room :string , infos : dto_changePass)//must check if current is owner
    {
      const data = await  this.prisma.room.findFirst({
        where : {
          name : room,
          type : "protected",
        }
      });
      if(data)
      {
        const new_password = await argon.hash(infos.new_password);
        return await  this.prisma.room.update({
        where :{
          name :  room,
        },
        data :{
          password : new_password
        }
      });
      }
      return data;
    }

    async check_user_to_invite(invite_dto: dto_invite)
    {
      const check = await this.prisma.user.findFirst({
        where:{
              username: invite_dto.user_to_invite
        }
      });
      return (check);
    }

    async add_user_to_room1(infos: dto_global)
    {
        const name_user = await this.prisma.user.findFirst({
          where:{
              username: infos.from
          }
        });
        if (name_user)
        {
          const new_join = await this.prisma.users_room.findFirst({
            where: {
              user_id: name_user.login,
              room_id : infos.to,
            }
          });
          if (new_join && (new_join.state_user === "banned" || new_join.state_user === "kicked"))
              return null;
          if (!new_join)
          {
              const new_join1 = await this.prisma.users_room.create({
                data:
                { 
                  user_id: name_user.login,
                  user_role: "user", 
                  room_id : infos.to,
                  state_user: ""
                }
              });
            return (new_join1);
          }
      }
    }
  
}
