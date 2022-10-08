import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game, Player } from './entities/game.entity';

@Injectable()
export class GameService {
	constructor(private prisma: PrismaService) {}
	private room = {} as Game;
	private room2 = {} as Game;

	create(id: string) {
		let r = new Game();
		this.room[id] = r;
		this.room[id].mode = 'classic';
	}

	addP(id: string, pl:Player, position:number){
		if (position === 0)
			this.room[id].P1 = pl;
		else 
			this.room[id].P2 = pl;
	}

	setStart(id : string)
	{
		this.room[id].pause = false; 
		this.room[id].started = true; 
	}

	getSize(){
		return Object.keys(this.room).length;
	}

	getRoom(id:string) : Game{
		if (this.room !== undefined)
			return this.room[id];
	}

	getRooms() : Game{
		return this.room;
	}

	remove(id: string) {
		delete this.room[id];
	}

	create2(id: string) {
		let r = new Game();
		this.room2[id] = r;
		this.room2[id].mode = 'rush';
	}

	addP2(id: string, pl:Player, position:number){
		if (position === 0)
			this.getRoom2(id).P1 = pl;
		else 
			this.getRoom2(id).P2 = pl;
	}

	setStart2(id : string)
	{
		this.room2[id].pause = false; 
		this.room2[id].started = true; 
	}

	getSize2(){
		return Object.keys(this.room2).length;
	}

	getRoom2(id:string) : Game{
		if (this.room2 !== undefined)
			return this.room2[id];
	}

	getRooms2() : Game{
		return this.room2;
	}

	remove2(id: string) {
		delete this.room2[id];
	}

	getAllRooms(): Game{
		return {...this.room, ...this.room2};
	};

	// getRoomByID(id:string) :Game
	// {
	// 	if (this.getRoom(id) !== undefined)
	// 		return (this.getRoom(id));
	// 	if (this.getRoom2(id) !== undefined)
	// 		return this.getRoom(id);
	// }

	async save_match_data(id : string, win:string, mode:number) {
		let game	: Game;
		let winner	: Player;
		let loser	: Player;
		mode === 1 ? game = this.getRoom(id) : game = this.getRoom2(id);
		(win === 'P1') ? winner = game.P1 : winner = game.P2;
		(win === 'P1') ? loser = game.P2 : loser = game.P1;

		await this.prisma.match_history.create({
			data:{
				mod: game.mode,
				match_date: new Date(),
				winner_id : winner.login,
				loser_id : loser.login,
				score_winner : winner.score,
				score_loser : loser.score
			}
		});
		await this.check_achievements(id, mode);
	};

	async insert_achiev(login : string, id: number)
	{
		const res = await this.prisma.userAchiev.findFirst({
			where: {
				achie_id: id,
				user_id: login
			},
		});
		if (!res)
		{
			await this.prisma.userAchiev.create({
				data:{
					achie_id: id , user_id:login,
				}
			})
		}
	}

	async check_achievements(id : string, mode:number) {
		let game	: Game;
		mode === 1 ? game = this.getRoom(id) : game = this.getRoom2(id);
		let players:Array<Player> = [];
		players[0] = game.P1;
		players[1] = game.P2;
		
		for (let id in players)
		{
			//check for acheivemnt 1
			const ach1 = await this.prisma.match_history.count({
				where:{
					OR:[
						{
							winner_id: players[id].login,
						},
						{
							loser_id: players[id].login,
						}					
					]
				}
			})
			if (ach1 > 0)
				await this.insert_achiev(players[id].login, 1);
		
			//check for acheivemnt 2
			const ach2 = await this.prisma.match_history.count({
				where:{
					mod: 'rush',
					winner_id: players[id].login,
				}
			})
			if (ach2 > 0)
				await this.insert_achiev(players[id].login, 2);

			//check for acheivemnt 3
			const ach3 = await this.prisma.match_history.count({
				where:{
					mod: 'classic',
					winner_id: players[id].login
				}
			})
			if (ach3 > 0)
				await this.insert_achiev(players[id].login, 3);

			//check for acheivemnt 4
			const ach4 = await this.prisma.match_history.findMany({
				where:{
					OR:[
						{
							winner_id: players[id].login,
						},
						{
							loser_id: players[id].login,
						}					
					]
				}
			})
			let sum  = 0;
			for (let line in ach4)
			{
				if (ach4[line].winner_id === players[id].login)
				sum += ach4[line].score_winner;
				if (ach4[line].loser_id === players[id].login)
				sum += ach4[line].score_loser;
			}
			if (sum > 30)
				await this.insert_achiev(players[id].login, 4);
			
			//check for acheivemnt 5
			const ach5 = await this.prisma.match_history.findFirst({
				where:{
					winner_id: players[id].login,
					score_loser: 0
				}
			})
			if (ach5)
				await this.insert_achiev(players[id].login, 5);
			
			//check for acheivemnt 6

			const ach6 = await this.prisma.match_history.findMany({
				where:{
					OR:[
						{
							winner_id: players[id].login,
						},
						{
							loser_id: players[id].login,
						}					
					]
				}
			})
			sum  = 0;
			for (let line in ach4)
			{
				if (ach4[line].winner_id === players[id].login)
				sum += ach4[line].score_winner;
				if (ach4[line].loser_id === players[id].login)
				sum += ach4[line].score_loser;
			}
			if (sum > 1000)
				await this.insert_achiev(players[id].login, 6);
			
		}
	}
}
