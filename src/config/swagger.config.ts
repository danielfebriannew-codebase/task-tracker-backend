import { DocumentBuilder } from '@nestjs/swagger';

export const getSwaggerConfig = () =>
  new DocumentBuilder()
    .setTitle('Finance Tracker API')
    .setDescription('API documentation for Finance Tracker application')
    .setVersion('1.0')
    .addTag('categories', 'Category management endpoints')
    .addTag('transactions', 'Transaction management endpoints')
    .addTag('dashboard', 'Dashboard and statistics endpoints')
    .build();
