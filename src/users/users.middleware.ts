import { NestMiddleware, Injectable } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { UserService } from './users.service'

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor (
    private readonly userService: UserService
  ) {}

  public async use (req: Request, res: Response, next: NextFunction): Promise<void> {
    const { SESSION_TOKEN } = req.cookies
    if (SESSION_TOKEN === undefined) {
      next()
      return
    }

    const user = await this.userService.resolveToken(SESSION_TOKEN)
    if (user === null) {
      next()
      return
    }

    res.locals.user = user
    next()
  }
}
