import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class msgInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
          .handle()
          .pipe(
            map(items => items.map(item => {

              return ({
                from : item.from,
                msg : item.content_msg,
                avatar : item.avatar
              });
          }))
          )
  }
}