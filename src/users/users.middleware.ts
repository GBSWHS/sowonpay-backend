import { NestMiddleware, Injectable } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { UserService } from './users.service'

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor (
    private readonly userService: UserService
  ) {}

  public use (req: Request, res: Response, next: NextFunction): void {
    const { authorization } = req.headers
    if (authorization === undefined) {
      next()
      return
    }

    const [type, token] = authorization.split(' ')
    if (type !== 'Token') {
      next()
      return
    }

    const user = this.userService.resolveToken(token)
    if (user === null) {
      next()
      return
    }

    res.locals.user = user
    next()
  }
}
