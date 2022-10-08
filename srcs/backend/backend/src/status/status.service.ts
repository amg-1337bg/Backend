import { Injectable } from '@nestjs/common';
import { Socket } from "socket.io";

export type P_data = {
  username : string;
  login   : string;
  avatar  : string;
}
export type data = {
  P1 : P_data;
  P2 : P_data;
  mod: number
}

@Injectable()
export class StatusService {
  private onlineUsers = {};
  private InGameUsers = {};

  addClient(login:string, socket: Socket){
    if (login in this.onlineUsers){
      this.onlineUsers[login].push(socket);
    }
    else
    {
      this.onlineUsers[login] = new Array<Socket>;
      this.onlineUsers[login].push(socket);
    }
  }

  clientInGame(login: string):boolean
  {
    if (this.checkOnline(login))
    {
        this.InGameUsers[login] = 1;
        return true;
    }
    return false;
  }

  clientFinishedGame(login: string)
  {
    if (this.InGameUsers[login] !== undefined)
      delete this.InGameUsers[login];
  }

  removeClient(login: string, socket: Socket){
    if (login in this.onlineUsers) {
      if (this.onlineUsers[login].length > 1){
      for (let i = 0; i < this.onlineUsers[login].length; i++)
      {
        if (this.onlineUsers[login][i] === socket)
          this.onlineUsers[login].splice(i, 1);
      }
      return false
      }
      else
        delete this.onlineUsers[login];
      return true;
    }
  }

  checkOnline(user: string) : boolean{
    if (this.onlineUsers[user] !== undefined && !this.InGameUsers[user])
      return true;
    return false;
  }

  inviteToGame(data : data) {
    if (this.checkOnline(data.P2.login)) {
      for (let i = 0; i < this.onlineUsers[data.P2.login].length; i++)
        this.onlineUsers[data.P2.login][i].emit('gameInvite', data);
    }

  }

  game_start_preps(client: Socket, data : data) {
    let key = Date.now();
    this.onlineUsers[data.P1.login][0].emit('start', {key: key, mod: data.mod});
    client.emit('start', {key: key, mod: data.mod});
  }

  getOnlineUser():any { return this.onlineUsers }
  getInGameUser():any { return this.InGameUsers }

  find(userId: string):string{

    if (userId in this.InGameUsers)
        return 'inGame';
    if (userId in this.onlineUsers) {
      return 'online';
    }
    return 'offline';
  }

}
