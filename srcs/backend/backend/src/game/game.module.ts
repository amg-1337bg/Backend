import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { ScheduleModule } from '@nestjs/schedule';
import { GameController } from './game.controller';
import { StatusService } from 'src/status/status.service';
import { StatusModule } from "../status/status.module";

@Module({
  imports : [
    ScheduleModule.forRoot(),
    StatusModule
  ],
  providers: [GameGateway, GameService],
  controllers: [GameController]
})
export class GameModule {}
