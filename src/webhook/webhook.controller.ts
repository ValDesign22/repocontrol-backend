import { Controller, Post, Req, Res } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import {
  GithubEvent,
  GithubEventAction,
  WebhookService,
} from './webhook.service';

@Controller({
  version: '1',
  path: 'api/webhook',
})
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post('/')
  async getWebhook(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    if (
      !(await this.webhookService.verifyWebhookSignature(
        req,
        process.env.GITHUB_WEBHOOK_SECRET!,
      ))
    ) {
      res.code(401);
      res.send({ message: 'Unauthorized' });
      return;
    }

    const githubEvent = req.headers['x-github-event'] as GithubEvent;
    if (githubEvent === GithubEvent.Push) {
      const data = req.body;
      console.log(data);
    } else if (githubEvent === GithubEvent.Issues) {
      const data: any = req.body;
      const action = data.action as GithubEventAction;
      console.log(`Received issue event with action: ${action}`);

      const { issue, sender } = data;
      const { url, html_url, repository_url, labels, number, title, user } =
        issue;

      switch (action) {
        case GithubEventAction.Closed:
          console.log(`
            Issue ${number} opened by ${user.login} has been closed by ${sender.login}
            Title: ${title}
            API_URL: ${url}
            URL: ${html_url}
            Repository URL: ${repository_url}
            Labels: ${labels.map((label: any) => label.name).join(', ')}
          `);
          break;
        case GithubEventAction.ReOpened:
          console.log(`
            Issue ${number} opened by ${user.login} has been re-opened by ${sender.login}
            Title: ${title}
            API_URL: ${url}
            URL: ${html_url}
            Repository URL: ${repository_url}
            Labels: ${labels.map((label: any) => label.name).join(', ')}
          `);
          break;
        default:
          break;
      }
    }
    res.send({ message: 'Webhook received' });
  }
}
