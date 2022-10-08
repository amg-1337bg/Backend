import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { RoomService } from '../room.service';

@Injectable()
export class clickRoom implements NestInterceptor {
  constructor(private roomService : RoomService) {

  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
          .handle()
          .pipe(
            map(item => ({
                room_id : item.room_id,
            }))
          )
  }
}
