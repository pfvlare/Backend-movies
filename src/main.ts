import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // CORS configurado para ngrok e desenvolvimento móvel
  app.enableCors({
    origin: [
      // Desenvolvimento local
      'http://localhost:3000',
      'http://127.0.0.1:3000',

      // Expo desenvolvimento
      'http://localhost:19006', // Expo web
      'http://localhost:19000', // Expo DevTools
      /^http:\/\/192\.168\.\d+\.\d+:19006$/, // Expo web em rede local
      /^http:\/\/10\.\d+\.\d+\.\d+:19006$/, // Expo web em rede local (iOS simulator)

      // Ngrok URLs
      'https://wholly-lenient-man.ngrok-free.app',
      /^https:\/\/.*\.ngrok-free\.app$/, // Qualquer subdomínio ngrok novo
      /^https:\/\/.*\.ngrok\.io$/, // Ngrok URLs antigas

      // Expo Go
      /^exp:\/\/.*/, // Expo Go protocol
      /^exps:\/\/.*/, // Expo Go secure protocol

      // React Native development
      'http://localhost:8081', // Metro bundler
      /^http:\/\/192\.168\.\d+\.\d+:8081$/, // Metro em rede local
      /^http:\/\/10\.\d+\.\d+\.\d+:8081$/, // Metro em rede local (iOS)
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'ngrok-skip-browser-warning',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
      'X-Forwarded-For',
      'X-Forwarded-Proto',
      'User-Agent',
    ],
    exposedHeaders: [
      'Content-Length',
      'Content-Type',
      'Date',
      'ETag',
      'Last-Modified',
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Middleware para adicionar headers necessários
  app.use((req: any, res: any, next: any) => {
    // Headers específicos para ngrok
    res.header('ngrok-skip-browser-warning', 'true');

    // Headers de segurança para desenvolvimento
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');

    // Log detalhado para debug
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🌐 ${req.method} ${req.url} - Origin: ${req.get('origin') || 'No origin'}`);
      console.log(`📱 User-Agent: ${req.get('user-agent')?.substring(0, 50) || 'Unknown'}...`);
    }

    next();
  });

  // Pipe de validação global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: false,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Swagger/OpenAPI configuração
  const config = new DocumentBuilder()
    .setTitle('Project Name API')
    .setDescription('Documentação automática gerada pelo Swagger')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Desenvolvimento Local')
    .addServer('https://wholly-lenient-man.ngrok-free.app', 'Ngrok Development')
    .addBearerAuth()
    .addTag('auth', 'Autenticação e autorização')
    .addTag('users', 'Gerenciamento de usuários')
    .addTag('subscriptions', 'Assinaturas e planos')
    .addTag('cards', 'Cartões de crédito')
    .addTag('profiles', 'Perfis de usuário')
    .addTag('tmdb', 'The Movie Database')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
    customSiteTitle: 'Project Name API Docs',
    customfavIcon: '/favicon.ico',
  });

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req: any, res: any) => {
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      services: {
        database: 'connected', // Você pode adicionar check real do DB aqui
        tmdb: 'connected',
      }
    };

    console.log('✅ Health check accessed');
    res.status(200).json(healthCheck);
  });

  // Endpoint de teste para ngrok
  app.getHttpAdapter().get('/test', (req: any, res: any) => {
    console.log('🧪 Test endpoint accessed');
    res.status(200).json({
      message: 'API funcionando!',
      timestamp: new Date().toISOString(),
      headers: req.headers,
      origin: req.get('origin'),
      userAgent: req.get('user-agent'),
    });
  });

  const port = process.env.PORT || 3000;

  // Bind em todas as interfaces para permitir acesso externo
  await app.listen(port, '0.0.0.0');

  const urls = [
    `http://localhost:${port}`,
    `http://0.0.0.0:${port}`,
    'https://wholly-lenient-man.ngrok-free.app'
  ];

  console.log('\n🚀 ===== APPLICATION STARTED =====');
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⚡ Port: ${port}`);
  console.log('\n📡 Available URLs:');
  urls.forEach(url => console.log(`   ${url}`));
  console.log(`\n📚 API Documentation:`);
  urls.forEach(url => console.log(`   ${url}/api-docs`));
  console.log(`\n🏥 Health Check:`);
  urls.forEach(url => console.log(`   ${url}/health`));
  console.log('\n🔄 CORS enabled for mobile development');
  console.log('📱 Ready for Expo Go and ngrok!');
  console.log('===================================\n');
}

bootstrap().catch(err => {
  console.error('❌ Failed to start application:', err);
  process.exit(1);
});