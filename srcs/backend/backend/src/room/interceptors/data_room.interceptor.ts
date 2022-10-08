import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { RoomService } from '../room.service';

@Injectable()
export class DataRoomInterceptor implements NestInterceptor {
  constructor(private roomService : RoomService) {

  }
intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return  next
          .handle()
          .pipe(
            map(items => items.map(item => {
              
              
              return ({
                room_id : item.name,
                owner : item.owner,
                count :  item._count.users_room
              });
          }))
          )
  }
}
