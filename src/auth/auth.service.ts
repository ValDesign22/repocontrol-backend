import { Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthService {
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

    if (!token) {
      return null;
    }

    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    const userInfos = await userRes.json();

    return userInfos;
  }

  deleteSession(req: FastifyRequest) {
    req.session.delete();
  }

  setSession(req: FastifyRequest, userInfos: any) {
    req.session.set('userInfos', userInfos);
  }

  getSession(req: FastifyRequest) {
    return req.session.get('userInfos');
  }

  getReposWithToken(req: FastifyRequest) {
    const session = this.getSession(req);
    if (!session) {
      return null;
    }

    return fetch(`https://api.github.com/users/${session.login}/repos`);
  }
}
