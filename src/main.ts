import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'

import * as cookieParser from 'cookie-parser'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())
  app.setGlobalPrefix('/api')

  const portEnv = process.env.PORT

  if (portEnv === undefined) {
    await app.listen(8080)
    return
  }

  await app.listen(portEnv)
}

void bootstrap()
