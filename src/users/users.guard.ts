import { ExecutionContext, CanActivate, Injectable } from '@nestjs/common'

@Injectable()
export class UserGuard implements CanActivate {
  public canActivate (context: ExecutionContext): boolean {
    const response = context.switchToHttp().getResponse()
    return response.locals.user !== undefined && response.locals.user !== null
  }
}
