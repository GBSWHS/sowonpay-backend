import { NestMiddleware, Injectable } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { AuthService } from './auth.service'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor (
    private readonly authService: AuthService
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

    const user = this.authService.resolveToken(token)
    if (user === null) {
      next()
      return
    }

    res.locals.user = user
    next()
  }
}
