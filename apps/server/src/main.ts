import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './common/filters/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api', {
    exclude: ['/uploads/(.*)'],
  })

  // CORS 配置
  const corsOrigin = process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:5173',
    'http://localhost:4173',
  ]

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  app.useGlobalFilters(new GlobalExceptionFilter())

  // Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('EA-LowCode API')
    .setDescription('EA-LowCode 平台后端 API 文档')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: '输入 JWT Token',
        in: 'header',
      },
      'JWT-auth'
    )
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document)

  await app.listen(process.env.PORT ?? 3000)
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`)
  console.log(`Swagger API Docs: http://localhost:${process.env.PORT ?? 3000}/api-docs`)
}
bootstrap()
