import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { ReposController } from './repos/repos.controller';
import { ReposService } from './repos/repos.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, AuthController, ReposController],
  providers: [AppService, AuthService, ReposService],
})
export class AppModule {}
