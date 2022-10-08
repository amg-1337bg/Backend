import { Controller, Get } from '@nestjs/common';
import { Game } from './entities/game.entity';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
		constructor(private readonly gameService: GameService) {}

		@Get('live_matchs')
		get_live_matchs(): Game {
			return this.gameService.getAllRooms();
		}
}
