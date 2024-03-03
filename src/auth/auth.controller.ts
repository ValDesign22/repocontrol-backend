import { Controller, Get, Req, Res } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service';

@Controller({
  version: '1',
  path: 'api/auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/')
  async getAuth(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const session = this.authService.getSession(req);
    if (session) {
      console.log(session);

      res.send({
        message: `Already logged in, welcome back ${session.user.login}`,
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

    const auth = await this.authService.getAuth(code);

    if (!auth) {
      res.send({ message: 'An error occured' });
      return;
    }

    this.authService.setSession(req, auth);

    res.send({ message: `Welcome ${auth.user.login}` });
  }

  @Get('/logout')
  async logout(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    this.authService.deleteSession(req);
    res.send({ message: 'Logged out' });
  }
}
