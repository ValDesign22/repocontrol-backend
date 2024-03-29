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

    const repos = await this.reposService.getRepos(req);

    if (!repos) {
      res.status(500).send({ message: 'An error occured' });
      return;
    }
    const data = await repos.json();

    res.send({ repos: data });
  }

  @Get('/:repoName')
  async getRepo(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const session = this.authService.getSession(req);
    if (!session) {
      res.status(401).send({ message: 'Unauthorized' });
      return;
    }

    const { repoName } = req.params as FastifyRequest['params'] & {
      repoName: string;
    };

    const repo = await this.reposService.getRepo(req, repoName);

    if (!repo) {
      res.status(500).send({ message: 'An error occured' });
      return;
    }

    res.send({ repo: await repo.json() });
  }

  @Get('/:repoName/issues')
  async getRepoIssues(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const session = this.authService.getSession(req);
    if (!session) {
      res.status(401).send({ message: 'Unauthorized' });
      return;
    }

    const { repoName } = req.params as FastifyRequest['params'] & {
      repoName: string;
    };

    const repoIssues = await this.reposService.getRepoIssues(req, repoName);

    if (!repoIssues) {
      res.status(500).send({ message: 'An error occured' });
      return;
    }

    res.send({ issues: await repoIssues.json() });
  }

  @Get('/:repoName/pulls')
  async getRepoPulls(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const session = this.authService.getSession(req);
    if (!session) {
      res.status(401).send({ message: 'Unauthorized' });
      return;
    }

    const { repoName } = req.params as FastifyRequest['params'] & {
      repoName: string;
    };

    const repoPulls = await this.reposService.getRepoPulls(req, repoName);

    if (!repoPulls) {
      res.status(500).send({ message: 'An error occured' });
      return;
    }

    res.send({ pulls: await repoPulls.json() });
  }
}
