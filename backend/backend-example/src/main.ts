import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const originRegex = new RegExp(
    /^https:\/\/([a-zA-Z0-9-]+\.)?dev\.local(:\d+)?$/,
  );

  app.enableCors({
    origin: (
      origin: string,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (
        process.env.APPLICATION_ENV === 'development' ||
        process.env.APPLICATION_ENV === 'qa'
      ) {
        return callback(null, true);
      }
      if (!origin) return callback(null, true);

      if (originRegex.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Filtered by CORS: ${origin}`));
      }
    },
    allowedHeaders: 'X-Requested-With, Content-Type, Accept, Observe',
    methods: 'GET,PUT,POST,PATCH,DELETE,UPDATE,OPTIONS',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
