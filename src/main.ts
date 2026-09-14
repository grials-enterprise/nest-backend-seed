import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { AppConfigService } from './config/config.service.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IAppConfig } from './config/configurations.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfigService);
  const appName = config.getApp<string>('APP_NAME');
  const appPort = config.getApp<number>('APP_PORT') as number;
  const availableVersions = config.getUtils(
    'AVAILABLE_VERSIONS',
  ) as IAppConfig['utils']['AVAILABLE_VERSIONS'];

  app.setGlobalPrefix(`${appName}/api`, {
    exclude: ['health', `${appName}/defaults-docs`],
  });

  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'l-api-version',
    defaultVersion: availableVersions[0],
  });

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //   }),
  // );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('DEFAULT API')
    .setDescription('PEGASI MED Default API microservice')
    .setVersion(availableVersions[0])
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${appName}/defaults-docs`, app, document);

  await app.listen(appPort);
}
await bootstrap();
