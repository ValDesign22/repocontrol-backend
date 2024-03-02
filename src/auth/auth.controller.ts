import { Controller, Get, Req, Res } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/')
  async getAuth(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const session = this.authService.getSession(req);
    if (session) {
      console.log(session);
      res.send({
        message: `Already logged in, welcome back ${session.login}`,
      });
      return;
    }

    const { code } = req.query as FastifyRequest['query'] & { code: string };

    if (!code) {
      res
        .status(302)
        .redirect(
          `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`,
        );
      return;
    }

    const userInfos = await this.authService.getAuth(code);

    if (!userInfos) {
      res.send({ message: 'An error occured' });
      return;
    }

    console.log(userInfos);

    this.authService.setSession(req, userInfos);

    res.send({ message: `Welcome ${userInfos.login}` });
  }

  @Get('/logout')
  async logout(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    this.authService.deleteSession(req);
    res.send({ message: 'Logged out' });
  }

  @Get('/repos')
  async getRepos(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const session = this.authService.getSession(req);
    if (!session) {
      res.status(401).send({ message: 'Unauthorized' });
      return;
    }

    const repos = await this.authService.getReposWithToken(req);

    if (!repos) {
      res.send({ message: 'An error occured' });
      return;
    }

    const data = await repos.json();

    if (data.length === 0) {
      res.send({ message: 'No repositories found' });
      return;
    }

    res.send({ data });
  }
}
