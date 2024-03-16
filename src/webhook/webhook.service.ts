import { Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import * as crypto from 'crypto';

@Injectable()
export class WebhookService {
  async verifyWebhookSignature(req: FastifyRequest, secret: string) {
    const signature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');
    const trusted = Buffer.from(`sha256=${signature}`, 'ascii');
    const untrusted = Buffer.from(
      req.headers['x-hub-signature-256'] as string,
      'ascii',
    );
    return crypto.timingSafeEqual(trusted, untrusted);
  }
}
