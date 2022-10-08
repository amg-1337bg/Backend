import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusGateway } from './status.gateway';

@Module({
  providers: [StatusGateway, StatusService],
  exports: [StatusService]
})
export class StatusModule {}
