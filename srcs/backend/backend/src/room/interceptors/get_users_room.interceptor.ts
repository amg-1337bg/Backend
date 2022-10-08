import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable ,map} from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
            .handle()
            .pipe(
              map((items :any)=> items.map(item => {
               
                return ({
                    id : item.user.id,
                    login: item.user.login,
                    username : item.user.username,
                    user_role : item.user_role,
                    avatar : item.user.avatar
                });
            }))
            )
           
}
}
