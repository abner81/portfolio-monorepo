import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('[Bootstrap] Starting NestJS application...');
  try {
    const app = await NestFactory.create(AppModule);
    console.log('[Bootstrap] NestJS application created');
    const port = process.env.PORT ? Number(process.env.PORT) : 3000;
    console.log(`[Bootstrap] Starting server on port ${port}...`);
    await app.listen(port);
    console.log(`[Bootstrap] Server running on http://localhost:${port}`);
  } catch (error) {
    console.error('[Bootstrap] Error starting application:', error);
    process.exit(1);
  }
}

void bootstrap();
