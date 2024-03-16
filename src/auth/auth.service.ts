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

    return { user, token };
  }

  setSession(req: FastifyRequest, userInfos: any) {
    req.session.set('userInfos', userInfos);
  }

  async getSession(req: FastifyRequest) {
    const session = req.session.get('userInfos');

    if (!session) return null;

    return session;
  }

  deleteSession(req: FastifyRequest) {
    req.session.delete();
  }
}
