import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { dm_room, dm_to, dto_block, dto_msg_dm } from '../dto/create-room.dto';
import { DmService } from './dm.service';

@WebSocketGateway({
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
  } 
  // ,namespace: '/dm'
 })

export class DmGateway {
  constructor(private prisma: PrismaService, private dm_service: DmService){}
  myMap = new Map();

  @WebSocketServer()
    server: Server;
    private logger: Logger = new Logger('AppGateway_DM');

  @SubscribeMessage('join_dm_room')
    async check_room_name(client: Socket, to: dm_to)
    {
      console.log("joiiiiiiiiiiiin :",to.to);
      let from = client.data.login;
      client.data.to = to.to;
      try
      {
        if (typeof from !== "undefined" && typeof to !== "undefined")
        {
              if (await this.dm_service.check_not_blocked(from , to))
                  client.emit("instant_messaging", {"status": true ,"action": "join",  "msg": `can't chat with ${to.to}`,  "from": from, "to": to.to});
              else
              {
                  const join_name = await this.dm_service.check_create_room_dm(from, to.to);
                  const get_name = await this.dm_service.find_dm_room_name(from, to.to);
                  for (let [key, value] of this.myMap)
                  {
                    if(value.room !== get_name.name && value.from === from)
                    {
                      this.server.sockets.sockets.get(key).leave(value.room);
                      this.server.sockets.sockets.get(key).leave(value.room_r);
                    }
                  }
                  await this.dm_service.update_frienship(from, to.to);
                  this.myMap.set(client.id, {"from": from, "to": to.to, "room": from + '+' + to.to + '+', "room_r": to.to + '+' + from + '+'});
                  client.join(join_name);
                  // for (let [key, value] of this.myMap)
                  // {
                  //   if(value.from === from && value.to === to.to)
                  //   {
                  //     console.log("from:" + from + "to:"+ to.to + "key:" + key + "  socket_id " + client.id);
                  //     // this.server.sockets.sockets.get(key).emit("instant_messaging", {"status": true ,"action": "join",  "msg": "Join Succes",  "from": from, "to": to.to});
                  //   }
                  // }
                  this.server.emit("instant_messaging", {"status": true ,"action": "join",  "msg": "Join Succes",  "from": from, "to": to.to})

              }
        }
      }
      catch(exception)
      {
        this.server.emit("instant_messaging", {"status": false, "action": "","msg": "Failed to join", "from": from, "to": to.to})
      }
    }

    @SubscribeMessage('dm_message')
    async send_msg(client: Socket, msg: dto_msg_dm){

      console.log("hellooooo from dm_message\n");
      console.log(msg);
      let from = client.data.login;
      let to = client.data.to;

      try{
        // before finding room name need to check if already blocked or no 
        const check = await this.prisma.friendship.findFirst({
            where :{
              OR:[
                {
                  id_user_1 : from,//current
                  id_user_2 : to,
                  stat_block : true
                },
                {
                  id_user_1 : to,//current
                  id_user_2 : from,
                  stat_block : true
                }
              ]
              
            }
          });
          if (!check)
          {
              const get_name = await this.dm_service.find_dm_room_name(from, to);
              console.log("get_name :" + get_name.name);
              if(get_name)
              {
                await this.dm_service.create_msg(from, to, msg);
                this.server.to(get_name.name).emit('msgToClient_dm', {"from": from, "msg": msg.msg});
              }   
          }
      }
      catch(exception)
      {
          client.emit('instant_messaging', {"from": from, "msg": "Error to send"});
      }
    }

    @SubscribeMessage('block_dm')
    async block_user(client: Socket)
    {
      let from = client.data.login;
      let to = client.data.to;
      
      try
      {
        const find = await this.dm_service.check_friend(from, to);
        if (find.type === "friend")
        {
          const join_name = await this.dm_service.check_create_room_dm(from, to);
          await this.dm_service.block_friend(from, to);
          this.server.emit("friends", {"status": true, "from": from, "to": to});
          for (let [key, value] of this.myMap)
          {
            if(value.from === to  && value.to === from)
            {
              console.log("from:" + from + "to:"+ to.to + "key:" + key);
              this.server.sockets.sockets.get(key).leave(value.room);
              this.server.sockets.sockets.get(key).leave(value.room_r);
              this.myMap.delete(key);
              // this.server.sockets.sockets.get(key).emit("disableWriting", {"status": false, "msg": `You are blocked by ${from}`, "user": to, "from": from});
              // this.server.sockets.sockets.get(key).emit("instant_messaging", {"status": true,"action": "block", "msg": `You are blocked by ${from}`, "user": to, "from": from});
            }
          }
          for (let [key, value] of this.myMap)
          {
            if(value.from === from && value.to === to)
            {
              console.log("from:" + from + "to:"+ to.to + "key:" + key);
              this.server.sockets.sockets.get(key).leave(value.room);
              this.server.sockets.sockets.get(key).leave(value.room_r);
              this.myMap.delete(key);
              // this.server.sockets.sockets.get(key).emit("instant_messaging", {"status": true,"action": "block", "msg": `User ${to} blocked with success`, "from": from, "to": to});
            }
          }
          this.server.emit("instant_messaging", {"status": true,"action": "block", "msg": `User ${to} blocked with success`, "from": from, "to": to});
        }
        else if (find.type === "user") 
        {
          const join_name = await this.dm_service.check_create_room_dm(from, to);
          await this.dm_service.block_friend(from, to);
          this.server.emit("friends", {"status": true, "from": from, "to": to});
          // this.server.emit("disableWriting", {"status": false, "msg": `You are blocked by ${from}`, "user": to, "from": from});
          // this.server.emit("instant_messaging", {"status": true,"action": "block", "msg": `User ${to} blocked with success`, "from": from, "to": to})
          for (let [key, value] of this.myMap)
          {
            if(value.from === to  && value.to === from)
            {
              console.log("from:" + from + "to:"+ to.to + "key:" + key);
              this.server.sockets.sockets.get(key).leave(value.room);
              this.server.sockets.sockets.get(key).leave(value.room_r);
              this.myMap.delete(key);
              this.server.sockets.sockets.get(key).emit("disableWriting", {"status": true,"action": "block", "msg": `You are blocked by ${from}`, "user": to, "from": from});
            }
          }
          for (let [key, value] of this.myMap)
          {
            if(value.from === from && value.to === to)
            {
              this.server.sockets.sockets.get(key).leave(value.room);
              this.server.sockets.sockets.get(key).leave(value.room_r);
              this.myMap.delete(key);
              console.log("from:" + from + "to:"+ to.to + "key:" + key);
              this.server.sockets.sockets.get(key).emit("instant_messaging", {"status": true,"action": "block", "msg": `User ${to} blocked with success`, "from": from, "to": to});
            }
          }
        }
        else 
        this.server.emit("instant_messaging", {"status": false,"action": "", "msg": `Failed to block user ${to}`, "from": from, "to": to})
      }
      catch(exception)
      {
        this.server.emit("instant_messaging", {"status": false,"action": "", "msg": `Failed to block user ${to}`, "from": from, "to": to})
      }
    }

    @SubscribeMessage('block_friend')
    async block_friend(client: Socket, to: dm_room)
    {
      try
      {
        let from = client.data.login;
        const find = await this.dm_service.check_friend(from, to.to);

        if (find.type === "friend")
        {
          const join_name = await this.dm_service.check_create_room_dm(from, to.to);
          await this.dm_service.block_friend(from, to.to);
          this.server.emit("friends", {"status": true, "from": from, "to": to.to});
          // this.server.emit("disableWriting", {"status": false, "msg": `You are blocked by ${from}`, "user": to, "from": from});
          this.server.emit("instant_messaging", {"status": true,"action": "block", "msg": `User ${to.to} blocked with success`, "from": from, "to": to.to})
          for (let [key, value] of this.myMap)
          {
            if (value.to === to.to && value.from === from)
            {
              this.server.sockets.sockets.get(key).leave(join_name);
              this.server.sockets.sockets.get(key).leave(value.room);
              this.server.sockets.sockets.get(key).leave(value.room_r);
              this.myMap.delete(key);
            }
          }
          for (let [key, value] of this.myMap)
          {
            if (value.from === from && value.to === to.to)
            {
              this.server.sockets.sockets.get(key).leave(join_name);
              this.server.sockets.sockets.get(key).leave(value.room);
              this.server.sockets.sockets.get(key).leave(value.room_r);
              this.myMap.delete(key);
            }
          }
        }
        }
        catch
        {

        }
    }

    handleDisconnect(client: Socket) {
    	this.logger.log(`Client disconnected: ${client.id}`);
      this.myMap.delete(client.id);
    }
  
    handleConnection(client: Socket) {
      client.data.login = client.handshake.auth.from;
    	this.logger.log(`Client connected: ${client.id}`);
    }
}
