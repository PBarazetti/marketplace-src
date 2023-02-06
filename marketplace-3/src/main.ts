import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
  .setTitle('SaudeID - Ecommerce API')
  .setDescription('Pedro Eduardo Rodrigues Barazetti')
  .setVersion('1.0')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);

const configService = app.get(ConfigService);
await app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.REDIS,
  options: {
    host: configService.get('REDIS_HOST'),
    port: configService.get('REDIS_PORT'),
  },
});
app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
