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

    console.log(user);
    console.log(token);

    return { user, token };
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

  async getInstallations(req: FastifyRequest) {
    const session = this.getSession(req);
    if (!session) return null;

    const res = await fetch(
      `https://api.github.com/users/${session.user.login}/installations`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      },
    );

    if (!res.ok) {
      console.log('An error occured');
      console.log(res);
      return null;
    }

    return res;
  }
}
