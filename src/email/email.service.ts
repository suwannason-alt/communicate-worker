import { Injectable } from '@nestjs/common';
import { Nack } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import type { IEmailPayload } from './interface/email.interface';
import { SaveAppLog } from '../utils/logger';
import * as path from 'path';
import { emailConsumerDecorator } from './email-consumer.decorator';
import fs from 'fs';
import Handlebars from 'handlebars';

const RabbitMQSubscribe = emailConsumerDecorator();

@Injectable()
export class EmailService {
  private readonly logger = new SaveAppLog(EmailService.name);
  private mailgun;
  constructor(private readonly configService: ConfigService) {
    this.mailgun = require('mailgun-js')({
      apiKey: configService.get<string>('SMTP_APIKEY'),
      domain: configService.get<string>('SMTP_HOST'),
    });
    // this.sendMail();
  }

  @RabbitMQSubscribe
  handleEmail(data: IEmailPayload) {
    try {
      this.logger.log(
        `Processing email for ${data.to}`,
        this.handleEmail.name,
        data,
      );
      this.logger.debug('Received email data:', data);
      this.sendMail(data);
      return new Nack();
    } catch (error) {
      this.logger.error(
        'Error processing email',
        error.stack,
        this.handleEmail.name,
      );
      return new Nack();
    }
  }

  sendMail(params: IEmailPayload) {
    try {
      // const params: IEmailPayload = {
      //   appname: 'kanoon',
      //   to: 'suwannasonsisuk@gmail.com',
      //   lang: 'th',
      //   template: 'invite',
      //   values: {
      //     company: '1moby',
      //   },
      //   subject: 'test',
      // };
      const templateFile = path.join(__dirname, '../templates');
      const templatePath = `${templateFile}/email/${params.appname}/${params.lang}/${params.template}.html`;

      fs.readFile(templatePath, 'utf8', (err, data) => {
        if (err) throw err;
        const template = Handlebars.compile(data);
        const fillTemplate = template(params.values);

        this.mailgun.messages().send(
          {
            from: `${params.appname}<no-reply@yellow.co.th>`,
            to: params.to,
            subject: params.subject,
            html: fillTemplate,
          },
          (error, body) => {
            if (error) {
              this.logger.error(error.message, error.stack, this.sendMail.name);
            } else {
              this.logger.log(`sendmail completed`, this.sendMail.name, body);
            }
          },
        );
      });
    } catch (error) {
      this.logger.error(error.message, error.stack, this.sendMail.name);
    }
  }
}
