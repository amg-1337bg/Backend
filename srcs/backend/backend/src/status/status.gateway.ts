import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage
} from "@nestjs/websockets";
import { data, StatusService } from "./status.service";
import { Server, Socket } from "socket.io";
import {Interval} from "@nestjs/schedule";

@WebSocketGateway({
  cors: {
    // origin: ['http://localhost:3000'],
    // ['http://10.11.11.5:3000', "http://10.11.10.11:3000"]
    origin : process.env.ORIGIN,
    credentials: true,
  },
  namespace: '/global'
})
export class StatusGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly statusService: StatusService) {}
  active_gamers = Object.keys(this.statusService.getInGameUser()).length;


  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    let user:string = client.handshake.auth.from;
    this.statusService.addClient(user,  client);
    this.server.emit('new_user', user);
  }

  handleDisconnect(client: Socket): any {
    let user:string = client.handshake.auth.from;
    if (this.statusService.removeClient(user, client))
      this.server.emit('user_offline', user);
  }

  @SubscribeMessage('invite')
  inviteToGame(client: Socket, player: data){
    this.statusService.inviteToGame(player);
  }

  @SubscribeMessage('accepted')
  accept_invite(client: Socket, player: data) {
    this.statusService.game_start_preps(client, player);
  }
  @Interval(3000)
  handleInterval() {
    if (Object.keys(this.statusService.getInGameUser()).length !== this.active_gamers) {
      this.active_gamers = Object.keys(this.statusService.getInGameUser()).length;
      this.server.emit('new_user', {});
    }
  }

  @Interval(3000)
  InGameInterval() {
    if (Object.keys(this.statusService.getInGameUser()).length !== this.active_gamers) {
      this.active_gamers = Object.keys(this.statusService.getInGameUser()).length;
      this.server.emit('in_game', {});
    }
  }
}

