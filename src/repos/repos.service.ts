import { Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

@Injectable()
export class ReposService {
  async getReposWithToken(req: FastifyRequest) {
    const session = req.session.get('userInfos');
    if (!session) return null;
    const res = await fetch(`https://api.github.com/user/repos`, {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    if (!res.ok) {
      console.log('An error occured while fetching repos');
      console.log(res);
      return null;
    }

    return res;
  }
}
