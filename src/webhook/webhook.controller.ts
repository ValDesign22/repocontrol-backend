import { Controller, Post, Req, Res } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { WebhookService } from './webhook.service';

@Controller({
  version: '1',
  path: 'api/webhook',
})
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post('/')
  async getWebhook(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    console.log(process.env.GITHUB_WEBHOOK_SECRET!);
    if (
      !this.webhookService.verifyWebhookSignature(
        req,
        process.env.GITHUB_WEBHOOK_SECRET!,
      )
    ) {
      res.code(401);
      res.send({ message: 'Unauthorized' });
      return;
    }

    const githubEvent = req.headers['x-github-event'];
    if (githubEvent === 'push') {
      console.log('Push event received');
      const data = req.body;
      console.log(data);
    }
    res.send({ message: 'Webhook received' });
  }
}
