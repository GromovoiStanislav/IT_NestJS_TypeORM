import {
  CanActivate,
  ExecutionContext,
  Injectable, UnauthorizedException
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthUserIdGuard implements CanActivate {

   canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

     if (!request.userId) {
       throw new UnauthorizedException();
     }

    return true;
  }
}