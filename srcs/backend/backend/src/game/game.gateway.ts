import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { GameService } from "./game.service";
import { Server, Socket } from "socket.io";
import { Ball, Player, Cmds } from "./entities/game.entity";
import { Interval } from "@nestjs/schedule";
import { PrismaService } from "src/prisma/prisma.service";
import { StatusService } from "src/status/status.service";

@WebSocketGateway({
	cors: {
		origin: process.env.ORIGIN,
		// origin '*',
		credentials: true
	}, namespace: "/game"
})

export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect{
	constructor(private gameService: GameService, private prisma: PrismaService, private SS: StatusService) {}
	@WebSocketServer() server: Server;
	players = {};
	players2 = {};
	invitation = {};
	id2: string;
	id: string;
	online_players_mode1:number = 0;
	online_players_mode2:number = 0;

	getID(): string {
		return Date.now().toString();
	}
	
	handleConnection(client: Socket) {
		if (!this.SS.clientInGame(client.handshake.auth.info.login)) // set status to 'in-game'
			return;
		if (client.handshake.auth.mode === "1")
		{
			if (client.handshake.auth.invite !== "")
			{
				let infos = client.handshake.auth.info;
				let id = client.handshake.auth.invite;
				if (this.gameService.getRoom(id) === undefined)
				{
					this.gameService.create(id);
					client.join(id);
					this.gameService.addP(id, {id : client.id, login: infos.login, username: infos.username, avatar: infos.avatar, x: 6, y: 200, w: 13, h:100, score: 0, scorpos: 1, room: id}, 0);
				}
				else
				{
					if (this.gameService.getRoom(id).full)
					{
						this.handleDisconnect(client);
						return;
					}
					client.join(id);
					this.gameService.addP(id, {id : client.id, login: infos.login, username: infos.username, avatar: infos.avatar, x: 981, y: 200, w: 13, h:100, score: 0,  scorpos: 3, room: id}, 1);
					this.gameService.getRoom(id).ball = {x: 500, y: 250, r: 10, speed: 6, velX: 6, velY: 6};
					this.gameService.getRoom(id).full = true;
					this.server.to(id).emit('start_game');
					this.gameService.getRoom(id).pause = true;
					let temp = id;
					setTimeout(() => {
						if (this.gameService.getRoom(temp).interupted === false)
						{
							this.gameService.setStart(temp);
							console.log(`Game :  ${temp} started ${this.gameService.getRoom(temp).started}`);
						}
						else
							this.gameOver(temp);
					}, 3000);
				}
				this.server.to(id).emit('update_connections', this.gameService.getRoom(id).P1, this.gameService.getRoom(id).P2, this.gameService.getRoom(id).ball);
				return ;
			}
			this.players[client.id] = {};
			this.online_players_mode1 = Object.keys(this.players).length;
			let info = client.handshake.auth.info;
			if (this.online_players_mode1 % 2 === 1)
			{
				this.id = this.getID();
				client.join(this.id);
				this.gameService.create(this.id);
				this.gameService.addP(this.id, {id : client.id, login: info.login, username: info.username, avatar: info.avatar, x: 6, y: 200, w: 13, h:100, score: 0, scorpos: 1, room: this.id}, 0);
				this.players[client.id] = {id : client.id, x: 6, y: 200, w: 13, h:100, score: 0, scorpos: 1, room: this.id};
			}
			if (this.online_players_mode1 % 2 === 0)
			{
				client.join(this.id);
				this.gameService.addP(this.id, {id : client.id, login: info.login, username: info.username, avatar: info.avatar, x: 981, y: 200, w: 13, h:100, score: 0,  scorpos: 3, room: this.id}, 1);
				this.players[client.id] = {id : client.id, x: 981, y: 200, w: 13, h:100, score: 0,  scorpos: 3, room: this.id};
				this.gameService.getRoom(this.id).ball = {x: 500, y: 250, r: 10, speed: 6, velX: 6, velY: 6};
				this.server.to(this.id).emit("start_game");
				this.gameService.getRoom(this.id).pause = true;
				let temp = this.id;
				setTimeout(() => {
					if (this.gameService.getRoom(temp).interupted === false)
					{
						this.gameService.setStart(temp);
						console.log(`Game :  ${temp} started ${this.gameService.getRoom(temp).started}`);
					}
					else
						this.gameOver(temp);
				}, 3000);
			}
			this.server.to(this.id).emit("update_connections", this.gameService.getRoom(this.id).P1, this.gameService.getRoom(this.id).P2, this.gameService.getRoom(this.id).ball);
		}
		if (client.handshake.auth.mode === "2")
		{
			if (client.handshake.auth.invite !== "")
			{
				let infos = client.handshake.auth.info;
				let id = client.handshake.auth.invite;
				if (this.gameService.getRoom2(id) === undefined)
				{
					this.gameService.create2(id);
					client.join(id);
					this.gameService.addP2(id, {id : client.id, login: infos.login, username: infos.username, avatar: infos.avatar, x: 6, y: 175, w: 13, h:150, score: 0, scorpos: 1, room: id}, 0);
				}
				else
				{
					if (this.gameService.getRoom2(id).full)
					{
						this.handleDisconnect(client);
						return;
					}
					client.join(id);
					this.gameService.addP2(id, {id : client.id, login: infos.login, username: infos.username, avatar: infos.avatar, x: 981, y: 175, w: 13, h:150, score: 0,  scorpos: 3, room: id}, 1);
					this.gameService.getRoom2(id).ball = {x: 500, y: 250, r: 10, speed: 6, velX: 6, velY: 6};
					this.gameService.getRoom2(id).full = true;
					this.server.to(id).emit('start_game');
					this.gameService.getRoom2(id).pause = true;
					let temp = id;
					setTimeout(() => {
						if (this.gameService.getRoom2(temp).interupted === false)
						{
							this.gameService.setStart2(temp);
							console.log(`Game :  ${temp} started ${this.gameService.getRoom2(temp).started}`);
						}
						else
							this.gameOver2(temp);
					}, 3000);
				}
				this.server.to(id).emit('update_connections', this.gameService.getRoom2(id).P1, this.gameService.getRoom2(id).P2, this.gameService.getRoom2(id).ball);
				return ;
			}
			this.players2[client.id] = {};
			this.online_players_mode2 = Object.keys(this.players2).length;
			let info = client.handshake.auth.info;
			if (this.online_players_mode2 % 2 === 1)
			{
				this.id2 = this.getID();
				client.join(this.id2);
				this.gameService.create2(this.id2);
				this.gameService.addP2(this.id2, {id : client.id, login: info.login, username: info.username, avatar: info.avatar, x: 6, y: 175, w: 13, h:150, score: 0, scorpos: 1, room: this.id2}, 0);
				this.players2[client.id] = {id : client.id, x: 6, y: 175, w: 13, h:150, score: 0, scorpos: 1, room: this.id2};
			}
			if (this.online_players_mode2 % 2 === 0)
			{
				client.join(this.id2);
				this.gameService.addP2(this.id2, {id : client.id, login: info.login, username: info.username, avatar: info.avatar, x: 981, y: 175, w: 13, h:150, score: 0,  scorpos: 3, room: this.id2}, 1);
				this.players2[client.id] = {id : client.id, x: 981, y: 175, w: 13, h:150, score: 0,  scorpos: 3, room: this.id2};
				this.gameService.getRoom2(this.id2).ball = {x: 500, y: 250, r: 10, speed: 5, velX: 5, velY: 5};
				this.server.to(this.id2).emit("start_game");
				this.gameService.getRoom2(this.id2).pause = true;
				let temp = this.id2;
				setTimeout(() => {
					if (this.gameService.getRoom2(temp)?.interupted === false)
					{
						this.gameService.setStart2(temp);
						console.log(`Game :  ${temp} started ${this.gameService.getRoom2(temp).started}`);
					}
					else
						this.gameOver2(temp);
				}, 3000);
			}
			this.server.to(this.id2).emit("update_connections", this.gameService.getRoom2(this.id2).P1, this.gameService.getRoom2(this.id2).P2, this.gameService.getRoom2(this.id2).ball);
		}
		if (client.handshake.auth.mode === "3")
			client.join(client.handshake.auth.room);
	}
	
	handleDisconnect(client: Socket) {
		this.SS.clientFinishedGame(client.handshake.auth.info.login); // remove in-game status
		if (client.handshake.auth.mode === "1")
		{
			let id:string = this.players[client.id]?.room;
			if (client.handshake.auth.invite !== '')
				id = client.handshake.auth.invite;
			let room = this.gameService.getRoom(id);
			if (room !== undefined)
			{
				if (room.P1.id !== "" && room.P2.id !==  "")
					client.id === room.P1.id ? room.P1.bailed = true : room.P2.bailed = true;
				if (room.pause)
					room.interupted = true;
				else
					this.gameOver(id);
			}
		}
		if (client.handshake.auth.mode === "2"){
			let id:string = this.players2[client.id]?.room;
			if (client.handshake.auth.invite !== '')
				id = client.handshake.auth.invite;
			let room = this.gameService.getRoom2(id);
			if (room !== undefined)
			{
				if (room.P1.id !== "" && room.P2.id !==  "")
					client.id === room.P1.id ? room.P1.bailed = true : room.P2.bailed = true;
				if (room.pause)
					room.interupted = true;
				else
					this.gameOver2(id);
			}
		}
	}

	@SubscribeMessage("usr_cmd")
	update_playerPos(client:Socket, id: Cmds) {
		if (client.handshake.auth.mode === "1"){
			let game = this.gameService.getRoom(id.room);
			if (id.key_up === true && game.P1.id === client.id && game.P1.y > 0)
				game.P1.y -= 5;
			if (id.key_down === true && game.P1.id === client.id && game.P1.y < 400)
				game.P1.y += 5;
			if (id.key_up === true && game.P2.id === client.id && game.P2.y > 0)
				game.P2.y -= 5;
			if (id.key_down === true && game.P2.id === client.id && game.P2.y < 400)
				game.P2.y += 5;
		}
		if (client.handshake.auth.mode === "2")
		{
			let game = this.gameService.getRoom2(id.room);
			if (id.key_up === true && game.P1.id === client.id && game.P1.y > 0)
				game.P1.y -= 5;
			if (id.key_down === true && game.P1.id === client.id&& (game.P1.y < 500 - (game.P1.h)))
				game.P1.y += 5;
			if (id.key_up === true && game.P2.id === client.id && game.P2.y > 0)
				game.P2.y -= 5;
			if (id.key_down === true && game.P2.id === client.id && (game.P2.y < 500 - (game.P2.h)))
				game.P2.y += 5;
		}
		else
			return ;
	}
	
	@SubscribeMessage("size_change")
	update_size(@ConnectedSocket() client:Socket, @MessageBody() screen_width:number)
	{
		let width:number, cof:number;
		cof = screen_width / 1000;
		width = 1000 * cof;
		client.emit("update", width, cof);
	}

	collision(ball: Ball, p :Player): boolean
	{
		let p_top = p.y;
		let p_bottom = p.y + p.h;
		let p_left = p.x;
		let p_right = p.x + p.w;
		
		let ball_top = ball.y - ball.r;
		let ball_bottom = ball.y + ball.r;
		let ball_left = ball.x - ball.r;
		let ball_right = ball.x + ball.r;
	
		return (ball_right > p_left && ball_top < p_bottom && ball_left < p_right && ball_bottom > p_top);
	}
	
	resetBall(index: string)
	{
		let game = this.gameService.getRoom(index);
		game.ball.speed = 6;
		game.ball.velX > 0 ? game.ball.velX = 6: game.ball.velX = -6;
		game.ball.velY > 0 ? game.ball.velY = 6: game.ball.velY = -6;
		game.ball.velX *= -1;
		game.ball.x = 500;
		game.ball.y = 250;
	}

	resetBall2(index: string)
	{
		let game =  this.gameService.getRoom2(index);
		game.ball.speed = 5;
		game.ball.velX > 0 ? game.ball.velX = 5: game.ball.velX = -5;
		game.ball.velY > 0 ? game.ball.velY = 5: game.ball.velY = -5;
		game.ball.velX *= -1;
		game.ball.x = 500;
		game.ball.y = 250;
	}

	update(id: string):void
	{
		let game = this.gameService.getRoom(id);
		game.ball.x += game.ball.velX;
		game.ball.y += game.ball.velY;
		if (game.ball.y + game.ball.r > 495 || game.ball.y - game.ball.r < 5)
			game.ball.velY *= -1;
		let player :Player = (game.ball.x < 500) ? game.P1 : game.P2;
		if (this.collision(game.ball, player))
		{
			let point = (game.ball.y - (player.y + (player.h / 2))) / (player.h / 2);
			let angle = point * (Math.PI / 4);
			let direction = (game.ball.x < 500) ? 1 : -1;
			if (game.ball.speed < 13)
				game.ball.speed += game.ball.speed * 0.05;
			game.ball.velX = direction * game.ball.speed * Math.cos(angle);
			game.ball.velY = game.ball.speed * Math.sin(angle);
		}
		if (game.ball.x + game.ball.r > 1000)
		{
			game.P1.score++;
			this.resetBall(id);
		}
		if (game.ball.x - game.ball.r < 0)
		{
			game.P2.score++;
			this.resetBall(id);
		}
		if (game.P1.score == 10 || game.P2.score == 10)
			this.gameOver(id);
	}

	update2(id: string):void
	{
		let game = this.gameService.getRoom2(id);
		game.ball.x += game.ball.velX;
		game.ball.y += game.ball.velY;
		if (game.ball.y + game.ball.r > 495 || game.ball.y - game.ball.r < 5)
			game.ball.velY *= -1;
		let p1 = game.P1;
		let p2 = game.P2;
		let player :Player = (game.ball.x < 500) ? p1 : p2;
		if (this.collision(game.ball, player))
		{
			let point = (game.ball.y - (player.y + (player.h / 2))) / (player.h / 2);
			if (player.id === p1.id && p1.h > 30)
			{
				game.P1.h -= 10;
				game.P1.y += 5;
			}
			if (player.id === p2.id && p2.h > 30)
			{
				game.P2.h -= 10;
				game.P2.y += 5;
			}
			let angle = point * (Math.PI / 4);
			let direction = (game.ball.x < 500) ? 1 : -1;
			game.ball.velX = direction * game.ball.speed * Math.cos(angle);
			game.ball.velY = game.ball.speed * Math.sin(angle);
			if (game.ball.speed < 13)
			game.ball.speed += game.ball.speed * 0.05;
			game.ball.speed += game.ball.speed * 0.05;
		}
		if (game.ball.x + game.ball.r > 1000)
		{
			game.P1.score++;
			this.resetBall2(id);
		}
		if (game.ball.x - game.ball.r < 0)
		{
			game.P2.score++;
			this.resetBall2(id);
		}
		if (game.P1.score == 5 || game.P2.score == 5)
			this.gameOver2(id);
	}

	async gameOver(index: string) {
		let game = this.gameService.getRoom(index);
		game.started = false;
		game.pause = true;
		this.resetBall(index);
		this.server.to(index).emit("update_connections", game.P1, game.P2, game.ball);
		this.server.to(index).emit("game_over");

		let win = "does not count";
		if (game.P1.bailed === true && game.P2.bailed === undefined)
		{
			win = "P2";
			game.P2.score = 10;
		}
		else if (game.P2.bailed === true && game.P1.bailed === undefined)
		{
			win = "P1";
			game.P1.score = 10;
		}
		else if (game.P2.bailed === undefined && game.P1.bailed === undefined && game.P1.login !== undefined && game.P2.login !== undefined)
		{
			if (game.P1.score > game.P2.score)
				win = "P1";
			else
				win = "P2";
		}
		if (win !== "does not count")
			await this.gameService.save_match_data(index, win, 1);
		
		
		delete this.players[game.P1.id];
		delete this.players[game.P2.id];
		this.gameService.remove(index);
		console.log("game over ", index);
	}
	
	async gameOver2(index: string) {
		let game = this.gameService.getRoom2(index);
		game.started = false;
		game.pause = true;
		this.resetBall2(index);
		this.server.to(index).emit("update_connections", game.P1, game.P2, game.ball);
		this.server.to(index).emit("game_over");
		let win = "does not count";
		if (game.P1.bailed === true && game.P2.bailed === undefined)
		{
			win = "P2";
			game.P2.score = 5;
		}
		else if (game.P2.bailed === true && game.P1.bailed === undefined)
		{
			win = "P1";
			game.P1.score = 5;
		}
		else if (game.P2.bailed === undefined && game.P1.bailed === undefined && game.P1.login !== undefined && game.P2.login !== undefined)
		{
			if (game.P1.score > game.P2.score)
				win = "P1";
			else
				win = "P2";
		}
		if (win !== "does not count")
			await this.gameService.save_match_data(index, win, 2);
		delete this.players2[game.P1.id];
		delete this.players2[game.P2?.id];
		this.gameService.remove2(index);
		console.log("game over 2", index);
	}

	@Interval(1000 / 40)
	handleInterval() {
		for (let id in this.gameService.getRooms())
		{
			let game = this.gameService.getRoom(id);
			if (!game.pause)
				this.server.to(id).emit("update_connections", game.P1, game.P2, game.ball);
			if (game.started)
				this.update(id);
		}
		for (let id in this.gameService.getRooms2())
		{
			let game = this.gameService.getRoom2(id);
			if (!game.pause)
				this.server.to(id).emit("update_connections", game.P1, game.P2, game.ball);
			if (game.started)
				this.update2(id);
		}
	}
}
