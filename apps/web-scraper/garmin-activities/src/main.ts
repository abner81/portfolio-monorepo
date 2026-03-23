import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  logger.log('Iniciando aplicação NestJS...');

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  logger.log('Módulo criado com sucesso');

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  await app.listen(port);

  logger.log(`Aplicação ouvindo na porta ${port}`);
}

bootstrap().catch((err) => {
  console.error('Erro ao iniciar aplicação:', err);
});
