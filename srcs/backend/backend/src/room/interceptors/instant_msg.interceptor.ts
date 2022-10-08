import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class InstantMsg implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
          .handle()
          .pipe(
            map(items => items.map(item => {

              return ({
                id : item.user2.id,
                login : item.user2.login,
                username : item.user2.username,
                avatar : item.user2.avatar,
                type: item.type,
              });
          }))
          )
  }
}


