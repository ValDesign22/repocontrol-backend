import { Controller, Post, Req, Res } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Controller({
  version: '1',
  path: 'api/webhook',
})
export class WebhookController {
  @Post('/')
  async getWebhook(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const githubEvent = req.headers['x-github-event'];
    if (githubEvent === 'push') {
      console.log('Push event received');
      const data = req.body;
      console.log(data);
    }
    res.send({ message: 'Webhook received' });
  }
}
