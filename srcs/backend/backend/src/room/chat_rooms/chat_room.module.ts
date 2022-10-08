import { Module } from '@nestjs/common';
import { AppGateway } from './chat_room.gateway';
import { ChatRoomService } from './chat_room.service';

@Module({
    providers: [ChatRoomService, AppGateway]
})
export class ChatRoomModule {}
