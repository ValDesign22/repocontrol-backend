import { Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

@Injectable()
export class ReposService {
  async getRepos(req: FastifyRequest) {
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

  async getRepo(req: FastifyRequest, repoName: string, name?: string) {
    const session = req.session.get('userInfos');
    if (!session) return null;

    const url = `https://api.github.com/repos/${name ?? session.user.login}/${repoName}`;
    console.log(url);

    const res = await fetch(
      `https://api.github.com/repos/${session.user.login}/${repoName}`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      },
    );

    if (!res.ok) {
      console.log('An error occured while fetching repo');
      console.log(res);
      return null;
    }

    return res;
  }

  async getRepoIssues(req: FastifyRequest, repoName: string, name?: string) {
    const session = req.session.get('userInfos');
    if (!session) return null;

    const res = await fetch(
      `https://api.github.com/repos/${name ?? session.user.login}/${repoName}/issues`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      },
    );

    if (!res.ok) {
      console.log('An error occured while fetching issues');
      console.log(res);
      return null;
    }

    return res;
  }

  async getRepoPulls(req: FastifyRequest, repoName: string, name?: string) {
    const session = req.session.get('userInfos');
    if (!session) return null;

    const res = await fetch(
      `https://api.github.com/repos/${name ?? session.user.login}/${repoName}/pulls`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      },
    );

    if (!res.ok) {
      console.log('An error occured while fetching pulls');
      console.log(res);
      return null;
    }

    return res;
  }
}
