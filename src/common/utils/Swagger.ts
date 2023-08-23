import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const Swagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Ticket Real-Time Application')
    .setDescription('Ticket Real-Time Application')
    .setVersion('v1')
    .addTag('Ticket')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
