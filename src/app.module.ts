import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { ReposController } from './repos/repos.controller';
import { ReposService } from './repos/repos.service';
import { WebhookController } from './webhook/webhook.controller';
import { WebhookService } from './webhook/webhook.service';
import { WebhookGateway } from './webhook/webhook.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    ReposController,
    WebhookController,
  ],
  providers: [
    AppService,
    AuthService,
    ReposService,
    WebhookService,
    WebhookGateway,
  ],
})
export class AppModule {}
