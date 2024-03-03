import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import secureSession from '@fastify/secure-session';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );

  await app.register(secureSession, {
    secret: process.env.SESSION_SECRET!,
    salt: process.env.SESSION_SALT!,
    cookieName: 'repocontrol_session',
    cookie: {
      secure: false,
    },
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(3001);
}
bootstrap();
