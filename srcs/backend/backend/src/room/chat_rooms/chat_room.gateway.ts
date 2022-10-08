import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Logger, UsePipes } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { PrismaService } from 'src/prisma/prisma.service';
import { dto_admin, dto_ban_mute, dto_changePass, dto_invite, dto_join_room, dto_kick, dto_msg } from "../dto/create-room.dto";
import { ChatRoomService } from './chat_room.service';
import { WSValidationPipe } from "../validationWs";

@WebSocketGateway({
    cors: {
        origin: process.env.ORIGIN, //"http://10.11.10.11:3000"],
        credentials: true,
    }
    // ,namespace: '/chatRoom'
})

export class AppGateway {
    
    constructor(private prisma: PrismaService, private chatroomservice: ChatRoomService){}
    myMap = new Map();

    @WebSocketServer()
    server: Server;
    private logger: Logger = new Logger('AppGateway');

    
    /***JoinRoom ************************************************************* test donee ==> see exalidraw  ************************************************************************* */
    @SubscribeMessage('JoinRoom')
    @UsePipes(WSValidationPipe)
    async Join_room(client: Socket, infos : dto_join_room)
	{
       client.leave(client.data.current_room);

        client.data.current_room = infos.room;
        const  user = client.data.from ;
        const room = client.data.current_room
        let error = 0;
        const check = this.myMap.get(client.id);
       try{
            if (typeof check !== "undefined" && ( check.user_id != user))
                error = 1; 
            else
            {
                if(await this.chatroomservice.getOwner(user, room))
                    this.myMap.set(client.id, {"user_id" : user , "room_id" : room , "user_role" : "owner"}) ;
                else 
                    this.myMap.set(client.id, {"user_id" : user , "room_id" : room , "user_role" : "user"}) ;
                if (!await this.chatroomservice.add_user_to_room({ from: user, to: room }))
                    error = 1 ;
                if(!error)
                {
                    client.join(room);
                    client.emit("roomsOfUser" , {"status" : true , "action" : "" , "message" : `Join ${room}` , "user" : `${user}`})
                }
            }
       }
        catch(exception)
        {
            client.emit("roomsOfUser" , {"status" : false , "action" : "" ,"message" :`${user} can't join ` , "user" :  `${user}`} );
        }
        if(error)
        {
            client.emit("roomsOfUser" , {"status" : false , "action" : "" , "message" :`${user} can't join ` , "user" :  `${user}`} );
        }
    }
 
    /***setAdmin ************************************************************* test donee ==> see exalidraw  ************************************************************************* */

    @SubscribeMessage('setAdmin')
    @UsePipes(WSValidationPipe)
    async setAdmin(client :Socket , infos : dto_admin)
    {
        
        const  user = client.data.from;
        const  room = client.data.current_room;
        let check = this.myMap.get(client.id);
        let error = 0;
        try {
            if(typeof check !== "undefined" && check.user_id === user && check.room_id === room && check.user_role === "owner")
            {
                if(await this.chatroomservice.setAdmin(infos, room))
                {
                   client.emit("roomsOfUser" , {"status" : true , "action" : "setAdmin" ,"message" : `${infos.new_admin} is a new admin in   ${room}` , "user" : user });
                   for (let [key, value] of this.myMap)
                    {
                        if(value.user_id === infos.new_admin)
                        {
                            this.server.sockets.sockets.get(key).emit("roomsOfUser" , {"status" : true , "action" : "admin", "message" :`you are admin of ${room}` , "user" : `${user}`})

                            if(value.room_id === room)
                            {
                                        this.myMap.set(key, {"user_id" : infos.new_admin , "room_id" : room , "user_role" : "admin"})
                            }
                        }
                    }
                }
                else error = 1;
            }
            else error = 1;
        }
        catch(exception)
        {
            error = 1;
        }
        if(error)
            client.emit("roomsOfUser" ,{"status" : false , "action" : "setAdmin" ,"message" : `action can't be done for ${infos.new_admin}` , "user" : user})
    }


/***mute ************************************************************* test donee ==> see exalidraw  ************************************************************************* */
  @SubscribeMessage('mute') 
  @UsePipes(WSValidationPipe)
  async mute_user(client : Socket , infos : dto_ban_mute)
  {
      const  user = client.data.from;
      const  room = client.data.current_room;
      const check = this.myMap.get(client.id);
      let error = 0 ;
      let time = 0;

      if (infos.type === "hour")
          time = infos.time * 60 * 60 * 1000;
      else if (infos.type === "minute")
          time = infos.time * 60 * 1000;
      else if (infos.type === "jour")
          time = infos.time * 24 * 60 * 60 * 1000;

      try
      {
          if ( typeof check  !== "undefined" &&  check.user_id === user && check.room_id === room && (check.user_role === "owner" || check.user_role === "admin" ))
          {
              if (await this.chatroomservice.ban_mute_user_in_room(room , infos.who,"muted",check.user_role))
              {
                      
                      client.emit("roomsOfUser", {"status" : true , "action" : "" ,"message" : `${infos.who}  muted successfully for ${infos.time} ${infos.type}` , "user" :  `${user}`})
                      for (let [key, value] of this.myMap)
                      {
                          if(value.user_id === infos.who)
                              this.server.sockets.sockets.get(key).emit("roomsOfUser", {"status" : true , "action" : "setAdmin" ,"message" : `you are muted at ${room} for ${infos.time} ${infos.type}` , "user" :  `${user}`})
                      }
                    
                      setTimeout(async () => {
                          if (!await this.chatroomservice.update_ban_mute_user_in_room(room , infos.who))
                              error = 1;
                          else
                          {
                              for (let [key, value] of this.myMap)
                              {
                                  if(value.user_id === infos.who)
                                      this.server.sockets.sockets.get(key).emit("roomsOfUser", {"status" : true , "action" : "setAdmin" ,"message" : `you are unmuted at  ${room}` , "user" :  `${user}`})
                              }
                          }
                      }, time)
              }else error = 1 ;
          }
          else error = 1;
      }
      catch(exception)
      {
          error = 1;
      }
      if (error)
          client.emit("roomsOfUser", {"status" : false , "action" : "" ,"message" : `action can't be done for ${infos.who}` , "user" : user })
  }
 

   /***ban ************************************************************* test donee ==> see exalidraw  ************************************************************************* */
   @SubscribeMessage('ban')
   @UsePipes(WSValidationPipe)
   async ban_user(client: Socket, infos: dto_ban_mute){
       const  user = client.data.from;
       const  room = client.data.current_room;
       const check = this.myMap.get(client.id);
       let error = 0 ;
       let time = 0 ;

       if (infos.type === "hour")
           time = infos.time * 60 * 60 * 1000;
       else if (infos.type === "minute")
           time = infos.time * 60 * 1000;
       else if (infos.type === "day")
           time = infos.time * 24 * 60 * 60 * 1000;
       try 
       {
           if( typeof check  !== "undefined" &&  check.user_id === user && check.room_id === room && (check.user_role === "owner" || check.user_role === "admin" ))
           {
               if(await this.chatroomservice.ban_mute_user_in_room(room , infos.who,"banned", check.user_role))
               {
                   client.emit("roomsOfUser", {"status" : true , "action" : "" ,"message" : `${infos.who}  banned successfully  for ${infos.time} ${infos.type}` , "user" :  `${user}`})

                   for (let [key, value] of this.myMap) 
                   {
                       if (value.user_id === infos.who ) 
                       {
                           this.server.sockets.sockets.get(key).leave(room);
                       }
                   }
                   for (let [key, value] of this.myMap)
                   {
                           if(value.user_id === infos.who)
                               this.server.sockets.sockets.get(key).emit("roomsOfUser", {"status" : true , "action" : "setAdmin" ,"message" : `you are banned at ${room}  for ${infos.time} ${infos.type}` , "user" :  `${user}`})
                   }

                   setTimeout(async () => {
                       if (!await this.chatroomservice.update_ban_mute_user_in_room(room , infos.who))
                           error = 1;
                           for (let [key, value] of this.myMap) 
                           {
                               if (value.user_id === infos.who) {
                                   this.server.sockets.sockets.get(key).join(room);
                               }
                           }
                           for (let [key, value] of this.myMap)
                           {
                               if(value.user_id === infos.who)
                                   this.server.sockets.sockets.get(key).emit("roomsOfUser", {"status" : true , "action" : "setAdmin" ,"message" : `you are unbanned at  ${room}` , "user" :  `${user}`})
                           }

                   }, time)
               }
               else error = 1 ;
           }
           else error = 1 ;

       }
       catch
       {
           error = 1 ;
       }
       if(error)
           client.emit("roomsOfUser", {"status" : false , "action" : "" , "message" : `action can't be done for ${infos.who}` , "user" : user })
   }

   /***kick ************************************************************* test donee ==> see exalidraw  ************************************************************************* */
    
    @SubscribeMessage('kick') /* test kick is done */
    @UsePipes(WSValidationPipe)
    async kick_user(client: Socket, infos: dto_kick){
        const  user = client.data.from;
        const  room = client.data.current_room;
        const check = this.myMap.get(client.id);
        let error = 0 ;
        try 
        {
            if( typeof check  !== "undefined" &&  check.user_id === user && check.room_id === room && (check.user_role === "owner" || check.user_role === "admin" ))
            {
                if(await this.chatroomservice.ban_mute_user_in_room(room , infos.who,"kicked", check.user_role))
                {

                    client.emit("roomsOfUser" , {"status" : true ,"action" : "setAdmin" ,  "message" : `${infos.who}  kicked successfully` , "user" :  user});
               
                    for (let [key, value] of this.myMap) 
                    {
                        if (value.user_id === infos.who) 
                        {
                            
                            this.server.sockets.sockets.get(key).leave(room);
                        }
                    }
             
                    for (let [key, value] of this.myMap)
                    {
                        if(value.user_id === infos.who)
                        {
                            this.server.sockets.sockets.get(key).emit("roomsOfUser", {"status" : true , "action" : "leave" ,"message" : `you are kickedd from  ${room}` , "user" :  `${user}`})
                            this.server.sockets.sockets.get(key).emit("UsersOfRoom", {"status" : true , "user" :  `${user}`})
                        }
                    }

                    this.server.to(room).emit("UsersOfRoom", {"status" : true , "user" :  `${user}`})
                   

                  
                }
                else error = 1 ;
            }
            else error = 1 ;
        }
        catch
        {
            error = 1 ;
        }
        if(error)
            client.emit("roomsOfUser", {"status" : false , "action" : "" , "message" : `action can't be done for ${infos.who}` , "user" : user })
    }

    /*sendMessage  ************************************************************* test donee ==> see exalidraw  ************************************************************************* */

    @SubscribeMessage('SendMessageRoom')
    @UsePipes(WSValidationPipe)
    async Send_message(client: Socket, msg: dto_msg){
        const  user = client.data.from;
        const  room = client.data.current_room;
        const check = this.myMap.get(client.id);
        let error = 0;
        try
        {
            if(typeof check !== "undefined" && check.user_id === user && check.room_id === room )
            {
                if (await this.chatroomservice.add_msg_room(user, room, msg)) /* send avatar in message */
                {
                    const arr = await this.chatroomservice.BlockedMe(user);
                    console.log("avataaar : ", msg.avatar);
                  if(arr.length === 0)
                  {
                      this.server.to(room).emit("msgToClient" ,{ "from" : user , "msg" : msg.msg ,"avatar" : msg.avatar});
                  }
                  else
                  {
                      for (let [key, value] of this.myMap) 
                      {
                    
                          if (value.room_id === room && !arr.includes(value.user_id))
                              this.server.sockets.sockets.get(key).emit("msgToClient" ,{ "from" : user , "msg" : msg.msg ,"avatar" :msg.avatar });
                       }
                  }
                }else
                {
                    client.emit("msgToClient" ,{ "from" : user , "msg" : msg.msg ,"avatar" :msg.avatar });
                }
            }
        }
        
        catch(exception)
        {
            client.emit("roomsOfUser", { "status": false, "action" : "" ,"message": `failed to send message`, "user": `${user}` });

        }
    }













    /*************************************************************************************************************************************** */
    @SubscribeMessage('inviteUser')
    async invit_user(client : Socket, invite_dto: dto_invite)
    {
        const from = client.handshake.auth.user;
        const room = client.data.current_room;
        
        try
        {
            const check = await this.chatroomservice.check_user_to_invite(invite_dto);
            if (check)
            {
                const ret = await this.chatroomservice.add_user_to_room1({ from: invite_dto.user_to_invite, to: room });
                if (ret)
                {
                    // this.server.to(room).emit("roomsOfUser" ,{"status" : true, "action" : "", "message" : `join ${room} successfully` , "user" : from });
                    // this.server.to(invite_dto.room).emit("usersOfRoom" ,{"status" : true, "message" : "" , "user" : from });
                    this.server.to(room).emit("UsersOfRoom", {"status" : true , "user" :  from});
                }
                else
                    client.emit("roomsOfUser" , {"status" : false ,"action" : "", "message" : "User to invite doesn't exist" , "user" : from}); 
            }
            else
                client.emit("roomsOfUser" , {"status" : false, "action" : "", "message" : "User to invite doesn't exist" , "user" : from}); 
        }
        catch(exception)
        {
            client.emit("roomsOfUser" , {"status" : false,"action" : "", "message" : "Error to invite user" , "user" : from});
        }
        
    }

    @SubscribeMessage('disablePassword')
    @UsePipes(WSValidationPipe)
    async disablePassword(client : Socket)
    {
        const  user = client.data.from;
        const  room = client.data.current_room;
        let check = this.myMap.get(client.id);
        let error = 0;
        try
        {
            if (typeof check !== "undefined" && check.user_id === user && check.user_role === "owner")
            {
                if (!await this.chatroomservice.disablePassword(user,room))
                {
                    
                    error = 1;
                } 
                else
                {
                    client.emit("roomsOfUser", {"status" : true , "action" : "setAdmin" ,"message" : `password is disabled successfully for ${room}` , "user" : user })
                    for (let [key, value] of this.myMap)
                    {
                            this.server.sockets.sockets.get(key).emit("roomsOfUser" , {"status" : true , "action" : "setAdmin", "message" :`password of ${room} is disabled` , "user" : `${user}`})

                    }
         
                }
            }
            else error = 1 ;
        }
        catch(exception)
        {
            client.emit("roomsOfUser" ,{status : false , "action" : "" , "message": "" ,  "user" : `${user}` })
        }
        if(error)
            client.emit("roomsOfUser" ,{status : false , "action" : "" , "message" : "" ,  "user" : `${user}` })
    }

    @SubscribeMessage('changePassword')
    @UsePipes(WSValidationPipe)
    async changePassword(client, infos : dto_changePass) 
    {

        const  user = client.data.from;
        const  room = client.data.current_room;
        const check = this.myMap.get(client.id);
        let error = 0 ;
        try {
            if (typeof check !== "undefined" && check.user_id === user && check.room_id === room && check.user_role === "owner") {
                const ret = await this.chatroomservice.changePassword(room, infos);
                if (ret)
                    client.emit("roomsOfUser", { "status": true, "action" : "setAdmin", "message": `password of ${room} has been changed successfully`, "user": `${user}` });
                else error = 1;
            }
            else error = 1;
        }
        catch (exception) {
            client.emit("roomsOfUser", { "status": false, "action" : "" ,"message": `failed to change password of  ${room}`, "user": `${user}` });
        }
        if(error)
            client.emit("roomsOfUser", { "status": false, "action" : "" ,"message": `failed to change password of  ${room}`, "user": `${user}` });

    }
    
  

   

   



    

  

    @SubscribeMessage('leaveRoom')
    @UsePipes(WSValidationPipe)
    async leaveRoom(client: Socket)
    {
        const  user = client.data.from;
        const  room = client.data.current_room;
        let check = this.myMap.get(client.id);
        let role = check.user_role;
        let error = 0;
   
        try 
        {
            if (typeof check !== "undefined" && check.user_id === user && check.room_id === room)
            {
                if (await this.chatroomservice.leaveRoom(check.user_role, room, user))
                {
                    for (let [key, value] of this.myMap)
                    {
                        if(value.user_id === user)
                        {
                            this.server.sockets.sockets.get(key).emit("roomsOfUser" , {"status" : true , "action" : "leave" , "message" :`you have  left ${room}` , "user" : `${user}`});
                            this.server.sockets.sockets.get(key).emit("UsersOfRoom", {"status" : true , "user" :  `${user}`});

                            if(value.room_id === room)
                            {
                                   this.server.sockets.sockets.get(key).leave(room);
                                   this.myMap.delete(key);
                            }
                          
                        }

                    }
                   this.server.to(room).emit("roomsOfUser" , {"status" : true , "action" : "setAdmin" , "message" :`${user} has left  ${room}` , "user" : `${user}`});
                   this.server.to(room).emit("UsersOfRoom", {"status" : true , "user" :  `${user}`});
              
                    if(role === "owner")
                    {
                        const ret = await this.chatroomservice.getNewOwner(room);
                        if(ret)
                        {
                            
                            for (let [key, value] of this.myMap)
                            {
                                if(value.user_id === ret.owner)
                                {
                                    if(value.room_id === room)
                                    {
                                        this.myMap.set(key, {"user_id" : ret.owner , "room_id" : room , "user_role" : "owner"})
                                        this.server.to(room).emit("UsersOfRoom", {"status" : true , "user" :  `${user}`});
                                    }
                                    this.server.sockets.sockets.get(key).emit("roomsOfUser" , {"status" : true , "action" : "owner", "message" :`you are the new owner of ${room}` , "user" : `${user}`})
                                    
                                }
                            }
                            
                        }
                    }
                }
                else  error = 1 ; /* if the client is not deleted successfully */
            }
            else error = 1 ; /* error case if client not joined */
       }
        catch(exception) /* case of something wrong , an exception is thrown by the server  :  a query failed ...  */
        {
            client.emit("roomsOfUser" , {"status" : false , "action" : "leave", "message" : `failed to leave ${room}` , "user" :  user})
        }
        if(error)
            client.emit("roomsOfUser" , {"status" : false , "action" : "leave", "message" : `failed to leave ${room}` , "user" :  user})
    }

 

    @SubscribeMessage("close")
    async close(client : Socket)
    {
       this.handleDisconnect(client);
    }
    async handleDisconnect(client: Socket) {
    
    	this.logger.log(`Client disconnected: ${client.id}`);
		this.myMap.delete(client.id);
    }
  
    async handleConnection(client: Socket) {
        
    	this.logger.log(`Client connected : ${client.id}`);
        client.data.from = client.handshake.auth.from ;

    }
}