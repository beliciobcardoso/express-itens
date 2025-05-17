import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Obtém o serviço de configuração
  const configService = app.get<ConfigService>(ConfigService);

  // Recupera a porta da variável de ambiente ou usa o valor padrão
  let port = 3000;

  const portStr = configService.get<string>('API_PORT');
  if (portStr && !isNaN(+portStr)) {
    port = +portStr;
  }

  const host = configService.get<string>('API_HOST') ?? '0.0.0.0';

  await app.listen(port, host);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
