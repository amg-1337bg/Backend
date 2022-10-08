import { Module } from '@nestjs/common';
import { DmGateway } from './dm.gateway';
import { DmService } from './dm.service';

@Module({
    providers: [DmService]
})
export class DmModule {}
