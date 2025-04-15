import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });
  const config = new DocumentBuilder()
    .setTitle('Hotel Management System')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('isit950')
    .build();
  const swaggerCDN = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.7.2';
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    customCssUrl: [`${swaggerCDN}/swagger-ui.css`],
    customJs: [
      `${swaggerCDN}/swagger-ui-bundle.js`,
      `${swaggerCDN}/swagger-ui-standalone-preset.js`,
    ],
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
