import { Controller, Post, Req, Res } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { GithubEvent, WebhookService } from './webhook.service';

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
      console.log('Push event received');
      const data = req.body;
      console.log(data);
    } else if (githubEvent === GithubEvent.Issues) {
      console.log('Issue event received');
      const data = req.body;
      console.log(data);
    }
    res.send({ message: 'Webhook received' });
  }
}
