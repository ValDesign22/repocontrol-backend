import { Controller, Get, Req, Res } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ReposService } from './repos.service';

@Controller({
  version: '1',
  path: 'api/repos',
})
export class ReposController {
  constructor(
    private authService: AuthService,
    private reposService: ReposService,
  ) {}

  @Get('/')
  async getRepos(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const session = this.authService.getSession(req);
    if (!session) {
      res.status(401).send({ message: 'Unauthorized' });
      return;
    }

    const repos = await this.reposService.getReposWithToken(req);

    if (!repos) {
      res.status(500).send({ message: 'An error occured' });
      return;
    }
    const data = await repos.json();
    console.log(data.length);

    // const installations = await this.authService.getInstallations(req);
    // if (!installations) {
    //   res.status(500).send({ message: 'An error occured' });
    //   return;
    // }

    res.send({ repos: data });
  }

  @Get('/:repoId')
  async getRepo(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const session = this.authService.getSession(req);
    if (!session) {
      res.status(401).send({ message: 'Unauthorized' });
      return;
    }

    const { repoId } = req.params as FastifyRequest['params'] & {
      repoId: string;
    };

    const repos = await this.reposService.getReposWithToken(req);

    if (!repos) {
      res.status(500).send({ message: 'An error occured' });
      return;
    }

    const data = await repos.json();
    const repo = data.find((repo: any) => repo.id === parseInt(repoId, 10));

    if (!repo) {
      res.status(500).send({ message: 'An error occured' });
      return;
    }

    res.send({ repo });
  }

  @Get('/:repoId/issues')
  async getRepoIssues(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const session = this.authService.getSession(req);
    if (!session) {
      res.status(401).send({ message: 'Unauthorized' });
      return;
    }

    const { repoId } = req.params as FastifyRequest['params'] & {
      repoId: string;
    };

    const repos = await this.reposService.getReposWithToken(req);

    if (!repos) {
      res.status(500).send({ message: 'An error occured' });
      return;
    }

    const data = await repos.json();
    const repo = data.find((repo: any) => repo.id === parseInt(repoId, 10));

    if (!repo) {
      res.status(500).send({ message: 'An error occured' });
      return;
    }

    const issues = await fetch(repo.issues_url.replace('{/number}', ''));

    if (!issues) {
      res.status(500).send({ message: 'An error occured' });
      return;
    }

    const issuesData = await issues.json();

    res.send({ issues: issuesData });
  }
}
