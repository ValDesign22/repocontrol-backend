import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import secureSession from '@fastify/secure-session';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  await app.register(secureSession, {
    secret: process.env.SESSION_SECRET!,
    salt: process.env.SESSION_SALT!,
    cookieName: 'repocontrol_session',
    cookie: {
      secure: false,
    },
  });

  await app.listen(3001);
}
bootstrap();
