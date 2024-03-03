import { Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UserService } from 'src/prisma/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async getAuth(code: string) {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
      }),
    });

    const data = await res.text();
    const params = new URLSearchParams(data);
    const token = params.get('access_token');

    if (!token) return null;

    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userRes.ok) {
      console.log('An error occured');
      console.log(userRes);
      return null;
    }

    const user = await userRes.json();

    this.userService.createUser({
      login: user.login,
      id: user.id,
      avatar_url: user.avatar_url,
      email: user.email,
      url: user.html_url,
    });

    return { user, token };
  }

  setSession(req: FastifyRequest, userInfos: any) {
    req.session.set('userInfos', userInfos);
  }

  async getSession(req: FastifyRequest) {
    const session = req.session.get('userInfos');

    const dbUser = await this.userService.getUser({
      id: req.session.get('userInfos').user.id,
    });

    if (!dbUser) {
      await this.userService.createUser({
        login: session.user.login,
        id: session.user.id,
        avatar_url: session.user.avatar_url,
        email: session.user.email,
        url: session.user.html_url,
      });
    }

    return session;
  }

  deleteSession(req: FastifyRequest) {
    req.session.delete();
  }
}
